import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { User } from '../data/models.js'

describe('POST /users/password/reset/:token', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server
    let baseUrl

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        baseUrl = `http://127.0.0.1:${server.address().port}/users/password/reset`
    })

    beforeEach(() => User.deleteMany())
    afterEach(() => User.deleteMany())

    test('updates the password hash and returns 204 without a body', async () => {
        const oldPassword = 'OldPass123'
        const newPassword = 'NewPass456'
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.invalid',
            username: 'testuser',
            password: await bcrypt.hash(oldPassword, 10)
        })
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '15m' })

        const response = await fetch(`${baseUrl}/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        })

        expect(response.status).toBe(204)
        expect(await response.text()).toBe('')
        const updatedUser = await User.findById(user.id)
        expect(updatedUser.password).not.toBe(user.password)
        expect(await bcrypt.compare(newPassword, updatedUser.password)).toBe(true)
        expect(await bcrypt.compare(oldPassword, updatedUser.password)).toBe(false)
    })

    test.each([
        ['malformed token', () => 'invalid-token'],
        ['invalid signature', () => jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, 'another-test-secret')],
        ['expired token', () => jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret, { expiresIn: -1 })]
    ])('rejects an %s', async (_description, createToken) => {
        const response = await fetch(`${baseUrl}/${createToken()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword: 'NewPass456' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'Invalid or expired token'
        })
        expect(await User.countDocuments()).toBe(0)
    })

    test('returns not found when the token user does not exist', async () => {
        const token = jwt.sign({ sub: new mongoose.Types.ObjectId().toString() }, secret, { expiresIn: '15m' })

        const response = await fetch(`${baseUrl}/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword: 'NewPass456' })
        })

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'User not found' })
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
