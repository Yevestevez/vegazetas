import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { User } from '../data/models.js'

describe('GET /users/name', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server
    let url

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        const app = createApp()
        server = await new Promise((resolve, reject) => {
            const listener = app.listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        url = `http://127.0.0.1:${server.address().port}/users/name`
    })

    beforeEach(() => User.deleteMany())
    afterEach(() => User.deleteMany())

    test('returns the authenticated user name as a JSON string', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.invalid',
            username: 'testuser',
            password: 'synthetic-hash'
        })
        const token = jwt.sign({ sub: user.id }, secret)

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(200)
        expect(await response.json()).toBe('Test User')
    })

    test('returns not found when the token user does not exist', async () => {
        const token = jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret)

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
    })

    test('supports HEAD for an authenticated user', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.invalid',
            username: 'testuser',
            password: 'synthetic-hash'
        })
        const token = jwt.sign({ sub: user.id }, secret)

        const response = await fetch(url, { method: 'HEAD', headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toMatch(/^application\/json/)
        expect(await response.text()).toBe('')
    })

    test('returns a validation error for an invalid user id', async () => {
        const token = jwt.sign({ sub: 'short' }, secret)

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid userId length, must be 24 characters'
        })
    })

    test.each([
        ['missing subject', () => jwt.sign({}, secret)],
        ['string payload', () => jwt.sign('plain', secret)],
        ['non-string subject', () => jwt.sign('{"sub":7}', secret)]
    ])('returns a validation error for a token with %s', async (_description, createToken) => {
        const token = createToken()

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid userId type, must be a string'
        })
    })

    test('returns a validation error for a non-hexadecimal user id', async () => {
        const token = jwt.sign({ sub: 'z'.repeat(24) }, secret)

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid userId syntax, must be a 24-character hexadecimal string'
        })
    })

    test.each([
        ['missing authorization', () => undefined],
        ['malformed token', () => 'Bearer invalid'],
        ['invalid signature', () => `Bearer ${jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, 'another-test-secret')}`],
        ['expired token', () => `Bearer ${jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret, { expiresIn: -1 })}`],
        ['wrong authorization scheme', () => `Basic ${jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret)}`]
    ])('returns a generic authentication error for %s', async (_description, createAuthorization) => {
        const authorization = createAuthorization()
        const headers = authorization ? { Authorization: authorization } : {}

        const response = await fetch(url, { headers })

        expect(response.status).toBe(401)
        expect(response.headers.get('www-authenticate')).toBe('Bearer')
        expect(await response.json()).toEqual({ error: 'CredentialsError', message: 'invalid credentials' })
    })

    test('does not expose missing server configuration as an authentication error', async () => {
        const token = jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret)
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})
        delete process.env.JWT_SECRET

        try {
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

            expect(response.status).toBe(500)
            expect(await response.json()).toEqual({ error: 'SystemError', message: 'internal server error' })
            expect(log).toHaveBeenCalled()
        } finally {
            process.env.JWT_SECRET = secret
            log.mockRestore()
        }
    })

    test('does not expose a database failure', async () => {
        const token = jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret)
        const findById = vi.spyOn(User, 'findById').mockReturnValue({
            exec: () => Promise.reject(new Error('database details'))
        })
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})

        try {
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

            expect(response.status).toBe(500)
            expect(await response.json()).toEqual({ error: 'SystemError', message: 'internal server error' })
            expect(log).toHaveBeenCalled()
        } finally {
            findById.mockRestore()
            log.mockRestore()
        }
    })

    afterAll(async () => {
        try {
            if (server) {
                await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
            }
        } finally {
            try {
                await mongoose.disconnect()
            } finally {
                if (previousSecret === undefined) delete process.env.JWT_SECRET
                else process.env.JWT_SECRET = previousSecret
            }
        }
    })
})
