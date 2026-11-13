import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { errors, usernameSchema, validate } from 'com'
import createApp from '../app.js'
import { registerUser } from '../modules/users/registerUser/composition.ts'
import registerUserInApp from '../../app/src/logic/registerUser.js'

const syntaxMessage = 'invalid username syntax (solo minúsculas, números, guiones, guiones bajos o puntos, sin espacios. Máx. 25 caracteres)'

describe('shared username validation', () => {
    test.each(['a', 'a'.repeat(25), 'test_123.-', '.'])('accepts a username without changing it', username => {
        expect(usernameSchema.parse(username)).toBe(username)
        expect(validate.username(username)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid username type, must be a string'],
        [null, 'invalid username type, must be a string'],
        [5, 'invalid username type, must be a string'],
        ['', 'invalid username length, must be between 1 and 25 characters'],
        ['a'.repeat(26), 'invalid username length, must be between 1 and 25 characters'],
        ['🍎'.repeat(13), 'invalid username length, must be between 1 and 25 characters'],
        ['Test', syntaxMessage],
        ['test user', syntaxMessage],
        ['test\n', syntaxMessage],
        ['ñ', syntaxMessage]
    ])('rejects invalid username %s with its existing error', (username, message) => {
        expect(usernameSchema.safeParse(username).success).toBe(false)
        expect(() => validate.username(username)).toThrowError(errors.ValidationError)
        expect(() => validate.username(username)).toThrowError(message)
    })

    test('rejects invalid usernames in both registration consumers before I/O', () => {
        expect(() => registerUser('Ana', 'test@example.com', 'Test', 'abc12345')).toThrowError(syntaxMessage)
        expect(() => registerUserInApp('Ana', 'test@example.com', 'Test', 'abc12345')).toThrowError(syntaxMessage)
    })

    test('preserves the different field validation order during registration', () => {
        expect(() => registerUser('Ana', 'invalid', 'Test', 'abc12345')).toThrowError('invalid email syntax')
        expect(() => registerUserInApp('Ana', 'invalid', 'Test', 'abc12345')).toThrowError(syntaxMessage)
    })
})

describe('username HTTP validation', () => {
    let server

    beforeAll(async () => {
        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
    })

    test('returns the existing username error on registration', async () => {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Ana', email: 'test@example.com', username: 'Test', password: 'abc12345' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: syntaxMessage })
    })

    afterAll(async () => {
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    })
})
