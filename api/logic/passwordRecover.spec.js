import '../config/loadEnv.js'
import assert from 'node:assert/strict'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { User } from '../data/models.js'
import { errors } from 'com'
import passwordRecover from './passwordRecover.js'

const { NotFoundError, SystemError } = errors
const testEnv = {
    JWT_SECRET: 'local-disposable-test-secret',
    FRONTEND_URL: 'http://localhost:5173/',
    MAIL_FROM: 'noreply@example.invalid'
}

describe('passwordRecover', function () {
    const previousEnv = {}

    beforeAll(async () => {
        for (const key of [...Object.keys(testEnv), 'NODE_ENV']) {
            previousEnv[key] = process.env[key]
        }
        Object.assign(process.env, testEnv)
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })
    })

    beforeEach(async () => {
        process.env.NODE_ENV = 'development'
        await User.deleteMany()
    })

    const createUser = () => User.create({
        name: 'Test User',
        email: 'user@example.invalid',
        username: 'testuser',
        password: 'synthetic-only'
    })

    const recoverWithSimulatedTransport = async (email, createTransporter) => {
        const originalLog = console.log
        try {
            console.log = () => {}
            await passwordRecover(email, createTransporter)
        } finally {
            console.log = originalLog
        }
    }

    const assertRecoveryMessage = (message, user) => {
        expect(message.to).to.equal(user.email)
        expect(message.subject).to.equal('Recuperar contraseña Vegazetas')
        const match = message.html.match(/href="([^"]+)"/)
        expect(match).not.to.be.null
        const link = new URL(match[1])
        expect(link.origin + link.pathname).to.equal('http://localhost:5173/password-reset')
        const payload = jwt.verify(link.searchParams.get('token'), testEnv.JWT_SECRET)
        expect(payload.sub).to.equal(user.id)
        expect(payload.exp - payload.iat).to.equal(15 * 60)
    }

    test('sends a recovery link through the development transporter', async () => {
        const user = await createUser()
        let message
        const createTransporter = async () => ({
            sendMail: async mail => {
                message = mail
                return {}
            }
        })

        await recoverWithSimulatedTransport(user.email, createTransporter)

        assertRecoveryMessage(message, user)
        expect(message.from).to.equal('"Vegazetas" <noreply@example.invalid>')
        expect(message.text).to.include('/password-reset?token=')
    })

    test('sends a recovery link through the production transporter', async () => {
        process.env.NODE_ENV = 'production'
        const user = await createUser()
        let message
        const createTransporter = async () => ({
            emails: {
                send: async mail => {
                    message = mail
                }
            }
        })

        await recoverWithSimulatedTransport(user.email, createTransporter)

        assertRecoveryMessage(message, user)
        expect(message.from).to.equal('noreply@example.invalid')
    })

    test('formats the development recovery email with Nodemailer without sending it', async () => {
        const user = await createUser()
        const transporter = nodemailer.createTransport({ streamTransport: true, buffer: true })
        let delivery
        const createTransporter = async () => ({
            sendMail: async mail => {
                delivery = await transporter.sendMail(mail)
                return delivery
            }
        })

        await recoverWithSimulatedTransport(user.email, createTransporter)

        expect(delivery.envelope.to).toEqual([user.email])
        expect(delivery.message.toString()).toContain('Content-Type: multipart/alternative')
        expect(delivery.message.toString()).toContain('/password-reset?token')
    })

    test('builds the production recovery request with Resend without sending it', async () => {
        process.env.NODE_ENV = 'production'
        const user = await createUser()
        const fetchMock = vi.fn(async () => new Response('{"id":"test-message"}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }))
        vi.stubGlobal('fetch', fetchMock)

        try {
            await recoverWithSimulatedTransport(user.email, async () => new Resend('re_test_only'))

            expect(fetchMock).toHaveBeenCalledOnce()
            const [url, options] = fetchMock.mock.calls[0]
            expect(new URL(url).pathname).toBe('/emails')
            expect(options.method).toBe('POST')
            const message = JSON.parse(options.body)
            assertRecoveryMessage(message, user)
            expect(message.from).toBe('noreply@example.invalid')
        } finally {
            vi.unstubAllGlobals()
        }
    })

    test('fails on non existing user without creating a transporter', async () => {
        let transporterCreated = false
        const createTransporter = async () => {
            transporterCreated = true
        }

        await assert.rejects(passwordRecover('missing@example.invalid', createTransporter), error => {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('user not found')
            return true
        })
        expect(transporterCreated).to.be.false
    })

    test('surfaces transporter creation failures', async () => {
        const user = await createUser()
        const createTransporter = async () => { throw new Error('mail unavailable') }

        await assert.rejects(passwordRecover(user.email, createTransporter), error => {
            expect(error).to.be.instanceOf(SystemError)
            expect(error.message).to.equal('mail unavailable')
            return true
        })
    })

    test('surfaces delivery failures', async () => {
        const user = await createUser()
        const createTransporter = async () => ({
            sendMail: async () => { throw new Error('delivery failed') }
        })

        await assert.rejects(passwordRecover(user.email, createTransporter), {
            message: 'delivery failed'
        })
    })

    afterEach(() => User.deleteMany())

    afterAll(async () => {
        try {
            await mongoose.disconnect()
        } finally {
            for (const key of Object.keys(previousEnv)) {
                if (previousEnv[key] === undefined) delete process.env[key]
                else process.env[key] = previousEnv[key]
            }
        }
    })
})
