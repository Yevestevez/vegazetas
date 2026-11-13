import '../config/loadEnv.js'
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import mongoose from 'mongoose'
import { User } from '../data/models.js'
import { passwordRecover } from '../modules/users/passwordRecover/composition.ts'

describe('passwordRecover with Ethereal', () => {
    const testEnv = {
        NODE_ENV: 'development',
        JWT_SECRET: 'local-disposable-test-secret',
        FRONTEND_URL: 'http://localhost:5173',
        MAIL_FROM: 'noreply@example.invalid'
    }
    const previousEnv = {}
    let userId

    beforeAll(async () => {
        const uri = process.env.SPEC_MONGO_URL
        for (const key of Object.keys(testEnv)) previousEnv[key] = process.env[key]
        Object.assign(process.env, testEnv)
        await mongoose.connect(uri, { directConnection: true })
    }, 30000)

    test('sends a recovery email and returns an Ethereal preview', async () => {
        const id = randomUUID()
        const user = await User.create({
            name: 'Test User',
            email: `${id}@example.invalid`,
            username: `test-${id.slice(0, 8)}`,
            password: 'synthetic-only'
        })
        userId = user._id

        let output = ''
        const originalLog = console.log
        try {
            console.log = (...args) => { output += args.join(' ') + '\n' }
            await passwordRecover(user.email)
        } finally {
            console.log = originalLog
        }

        expect(output).to.match(/https:\/\/ethereal\.email\/message\/[^\s]+/)
    }, 30000)

    afterAll(async () => {
        try {
            if (userId) await User.deleteOne({ _id: userId })
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
    }, 30000)
})
