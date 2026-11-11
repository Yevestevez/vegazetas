import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
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

    test('forwards a database cast error to the HTTP error handler', async () => {
        const token = jwt.sign({ sub: 'z'.repeat(24) }, secret)

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(500)
        const body = await response.json()
        expect(body.error).toBe('SystemError')
        expect(body.message).toContain('Cast to ObjectId failed')
    })

    test('rejects a token with an invalid signature', async () => {
        const token = jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, 'another-test-secret')

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(500)
        expect(await response.json()).toEqual({ error: 'SystemError', message: 'invalid signature' })
    })

    test('rejects a request without an authorization header', async () => {
        const response = await fetch(url)

        expect(response.status).toBe(500)
        const body = await response.json()
        expect(body.error).toBe('SystemError')
        expect(body.message).toMatch(/authorization|undefined/)
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
