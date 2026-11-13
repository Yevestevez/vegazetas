import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { User } from '../data/models.js'

describe('GET /users/username', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server
    let url

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        url = `http://127.0.0.1:${server.address().port}/users/username`
    })

    beforeEach(() => User.deleteMany())
    afterEach(() => User.deleteMany())

    test('returns the authenticated user username as a JSON string', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.invalid',
            username: 'testuser',
            password: 'synthetic-hash'
        })
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '24h' })

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(200)
        expect(await response.json()).toBe('testuser')
    })

    test('returns not found when the token user does not exist', async () => {
        const token = jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret, { expiresIn: '24h' })

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
    })

    test('returns a validation error for an invalid user id', async () => {
        const token = jwt.sign({ sub: 'short' }, secret, { expiresIn: '24h' })

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid userId length, must be 24 characters'
        })
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
