import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { expect } from 'chai'
import mongoose from 'mongoose'
import { User } from '../data/models.js'
import passwordRecover from '../logic/passwordRecover.js'

describe('passwordRecover with Ethereal', function () {
    this.timeout(30000)

    const testEnv = {
        NODE_ENV: 'development',
        JWT_SECRET: 'local-disposable-test-secret',
        FRONTEND_URL: 'http://localhost:5173',
        MAIL_FROM: 'noreply@example.invalid'
    }
    const previousEnv = {}
    let userId

    before(async () => {
        const uri = process.env.SPEC_MONGO_URL
        if (!uri) throw new Error('SPEC_MONGO_URL must point to a disposable local database')
        let url
        try {
            url = new URL(uri)
        } catch {
            throw new Error('SPEC_MONGO_URL must be a valid MongoDB URI')
        }
        if (url.protocol !== 'mongodb:' || url.hostname !== '127.0.0.1' || !url.port ||
            url.pathname !== '/vegazetas_disposable' || url.username || url.password || url.search || url.hash) {
            throw new Error('SPEC_MONGO_URL must point to the documented disposable local database')
        }
        for (const key of Object.keys(testEnv)) previousEnv[key] = process.env[key]
        Object.assign(process.env, testEnv)
        await mongoose.connect(uri, { directConnection: true })
    })

    it('sends a recovery email and returns an Ethereal preview', async () => {
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
    })

    after(async () => {
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
    })
})
