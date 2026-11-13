import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { User } from '../data/models.js'

const { createMailTransporterMock } = vi.hoisted(() => ({
    createMailTransporterMock: vi.fn()
}))

vi.mock('../util/mailer.js', () => ({
    createMailTransporter: createMailTransporterMock
}))

import createApp from '../app.js'

describe('POST /users/password/recover', () => {
    const secret = 'local-disposable-test-secret'
    const testEnv = {
        JWT_SECRET: secret,
        FRONTEND_URL: 'http://localhost:5173/',
        MAIL_FROM: 'noreply@example.invalid',
        NODE_ENV: 'development'
    }
    const previousEnv = {}
    let server
    let url

    beforeAll(async () => {
        for (const key of Object.keys(testEnv)) previousEnv[key] = process.env[key]
        Object.assign(process.env, testEnv)
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        url = `http://127.0.0.1:${server.address().port}/users/password/recover`
    })

    beforeEach(async () => {
        createMailTransporterMock.mockReset()
        await User.deleteMany()
    })

    afterEach(async () => {
        await User.deleteMany()
        vi.restoreAllMocks()
    })

    test('sends a recovery link and returns the existing success response', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.invalid',
            username: 'testuser',
            password: 'synthetic-only'
        })
        let sentMail
        const sendMail = vi.fn(async mail => {
            sentMail = mail
            return { messageId: 'test-message-id' }
        })
        createMailTransporterMock.mockResolvedValue({ sendMail })
        vi.spyOn(console, 'log').mockImplementation(() => {})

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
        })

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual({ message: 'Correo de recuperación enviado' })
        expect(sentMail.to).toBe(user.email)
        expect(sentMail.from).toBe('"Vegazetas" <noreply@example.invalid>')

        const resetLink = new URL(sentMail.html.match(/href="([^"]+)"/)[1])
        expect(resetLink.origin + resetLink.pathname).toBe('http://localhost:5173/password-reset')
        const token = jwt.verify(resetLink.searchParams.get('token'), secret)
        expect(token.sub).toBe(user.id)
        expect(token.exp - token.iat).toBe(15 * 60)
    })

    test('returns the existing validation error for an invalid email', async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'invalid' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid email syntax' })
        expect(createMailTransporterMock).not.toHaveBeenCalled()
    })

    test('returns not found without creating a transporter when the email is unknown', async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'missing@example.invalid' })
        })

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
        expect(createMailTransporterMock).not.toHaveBeenCalled()
    })

    test('returns a system error when transporter creation fails', async () => {
        createMailTransporterMock.mockRejectedValue(new Error('mail unavailable'))

        const user = await User.create({
            name: 'Test User',
            email: 'user@example.invalid',
            username: 'testuser',
            password: 'synthetic-only'
        })
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
        })

        expect(response.status).toBe(500)
        expect(await response.json()).toEqual({ error: 'SystemError', message: 'mail unavailable' })
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
                for (const key of Object.keys(previousEnv)) {
                    if (previousEnv[key] === undefined) delete process.env[key]
                    else process.env[key] = previousEnv[key]
                }
            }
        }
    })
})
