import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { User } from '../data/models.js'

describe('POST /users/auth', () => {
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
        url = `http://127.0.0.1:${server.address().port}/users/auth`
    })

    beforeEach(() => User.deleteMany())
    afterEach(() => User.deleteMany())

    test('returns a JSON token for valid credentials that expires after 24 hours', async () => {
        const password = 'Abc12345'
        const user = await User.create({
            name: 'Ana Pérez',
            email: 'ana@example.com',
            username: 'anaperez',
            password: await bcrypt.hash(password, 10)
        })

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password })
        })

        expect(response.status).toBe(200)
        const token = await response.json()
        expect(typeof token).toBe('string')
        const payload = jwt.verify(token, secret)
        expect(payload.sub).toBe(user.id)
        expect(payload.exp).toBe(payload.iat + 24 * 60 * 60)
    })

    test.each([
        ['unknown email', 'missing@example.com', 'Abc12345'],
        ['wrong password', 'ana@example.com', 'Wrong1234']
    ])('returns the existing credentials error for %s', async (_description, email, password) => {
        await User.create({
            name: 'Ana Pérez',
            email: 'ana@example.com',
            username: 'anaperez',
            password: await bcrypt.hash('Abc12345', 10)
        })

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        expect(response.status).toBe(401)
        expect(await response.json()).toEqual({ error: 'CredentialsError', message: 'wrong credentials' })
    })

    test('returns an internal error when JWT signing is not configured', async () => {
        await User.create({
            name: 'Ana Pérez',
            email: 'ana@example.com',
            username: 'anaperez',
            password: await bcrypt.hash('Abc12345', 10)
        })
        delete process.env.JWT_SECRET

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'ana@example.com', password: 'Abc12345' })
            })

            expect(response.status).toBe(500)
            expect(await response.json()).toEqual({
                error: 'SystemError',
                message: 'secretOrPrivateKey must have a value'
            })
        } finally {
            process.env.JWT_SECRET = secret
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
