import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { emailSchema, errors, validate } from 'com'
import createApp from '../app.js'
import { authenticateUser } from '../modules/users/authenticateUser/composition.ts'
import { passwordRecover } from '../modules/users/passwordRecover/composition.ts'
import { registerUser } from '../modules/users/registerUser/composition.ts'
import loginUser from '../../app/src/logic/loginUser.js'
import passwordRecoverInApp from '../../app/src/logic/passwordRecover.js'
import registerUserInApp from '../../app/src/logic/registerUser.js'

describe('shared email validation', () => {
    test.each([
        'user@example.com',
        'first.last+tag@example.co.uk'
    ])('accepts the existing email form %s without changing it', email => {
        expect(emailSchema.parse(email)).toBe(email)
        expect(validate.email(email)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid email type, must be a string'],
        [null, 'invalid email type, must be a string'],
        [5, 'invalid email type, must be a string'],
        ['', 'invalid email syntax'],
        ['user@localhost', 'invalid email syntax'],
        ['user name@example.com', 'invalid email syntax'],
        ['user@example.c', 'invalid email syntax'],
        ['"quoted local"@example.com', 'invalid email syntax'],
        ['a@example.123', 'invalid email syntax']
    ])('rejects invalid email %s with its existing error', (email, message) => {
        expect(emailSchema.safeParse(email).success).toBe(false)
        expect(() => validate.email(email)).toThrowError(errors.ValidationError)
        expect(() => validate.email(email)).toThrowError(message)
    })

    test('rejects invalid email in API and frontend consumers before I/O', () => {
        const message = 'invalid email syntax'
        expect(() => registerUser('Ana', 'invalid', 'ana', 'abc12345')).toThrowError(message)
        expect(() => registerUserInApp('Ana', 'invalid', 'ana', 'abc12345')).toThrowError(message)
        expect(() => authenticateUser('invalid', 'abc12345')).toThrowError(message)
        expect(() => passwordRecover('invalid')).toThrowError(message)
        expect(() => loginUser('invalid', 'abc12345')).toThrowError(message)
        expect(() => passwordRecoverInApp('invalid')).toThrowError(message)
    })
})

describe('email HTTP validation', () => {
    let server

    beforeAll(async () => {
        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
    })

    test.each([
        ['/auth', { email: 'invalid', password: 'abc12345' }],
        ['/password/recover', { email: 'invalid' }]
    ])('preserves the email validation response for %s', async (path, body) => {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/users${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid email syntax' })
    })

    afterAll(async () => {
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    })
})
