import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { errors, passwordSchema, validate } from 'com'
import createApp from '../app.js'
import authenticateUser from '../logic/authenticateUser.js'
import passwordReset from '../logic/passwordReset.js'
import { registerUser } from '../modules/users/registerUser/composition.ts'
import registerUserInApp from '../../app/src/logic/registerUser.js'
import loginUser from '../../app/src/logic/loginUser.js'
import passwordResetInApp from '../../app/src/logic/passwordReset.js'

describe('shared password validation', () => {
    test.each([
        'Abc12345',
        'A'.repeat(24) + '1',
        'A1' + 'x'.repeat(23),
        'Ábc12345',
        'Abc1234🍎'
    ])(
        'accepts a password without changing it',
        password => {
            expect(passwordSchema.parse(password)).toBe(password)
            expect(validate.password(password)).toBeUndefined()
        }
    )

    test.each([
        [undefined, 'invalid password type, must be a string'],
        [null, 'invalid password type, must be a string'],
        [5, 'invalid password type, must be a string'],
        ['', 'invalid password length, must be between 8 and 25 characters'],
        ['Abc1234', 'invalid password length, must be between 8 and 25 characters'],
        ['A'.repeat(26) + '1', 'invalid password length, must be between 8 and 25 characters'],
        ['password', 'invalid password syntax'],
        ['12345678', 'invalid password syntax'],
        ['Abcd123 ', 'invalid password syntax'],
        ['ÄÄÄ12345', 'invalid password syntax'],
        ['Abc1234\n', 'invalid password syntax']
    ])('rejects invalid password %s with its existing error', (password, message) => {
        expect(passwordSchema.safeParse(password).success).toBe(false)
        expect(() => validate.password(password)).toThrowError(errors.ValidationError)
        expect(() => validate.password(password)).toThrowError(message)
    })

    test('rejects invalid passwords in all API and frontend consumers before I/O', () => {
        const message = 'invalid password syntax'
        expect(() => registerUser('Ana', 'ana@example.com', 'ana', 'password')).toThrowError(message)
        expect(() => registerUserInApp('Ana', 'ana@example.com', 'ana', 'password')).toThrowError(message)
        expect(() => authenticateUser('ana@example.com', 'password')).toThrowError(message)
        expect(() => loginUser('ana@example.com', 'password')).toThrowError(message)
        expect(() => passwordReset('token', 'password')).toThrowError(message)
        expect(() => passwordResetInApp('token', 'password')).toThrowError(message)
    })

    test('allows a password accepted by the shared schema in frontend registration', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ status: 201 })
        vi.stubGlobal('fetch', fetchMock)

        try {
            await registerUserInApp('Ana', 'ana@example.com', 'ana', 'Abc1234🍎')

            expect(fetchMock).toHaveBeenCalledOnce()
            expect(JSON.parse(fetchMock.mock.calls[0][1].body).password).toBe('Abc1234🍎')
        } finally {
            vi.unstubAllGlobals()
        }
    })
})

describe('password HTTP validation', () => {
    let server

    beforeAll(async () => {
        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
    })

    test.each([
        ['/auth', { email: 'ana@example.com', password: 'password' }],
        ['/password/reset/token', { newPassword: 'password' }]
    ])('preserves the password validation response for %s', async (path, body) => {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/users${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid password syntax' })
    })

    afterAll(async () => {
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    })
})
