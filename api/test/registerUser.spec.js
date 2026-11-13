import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { User } from '../data/models.js'

describe('POST /users', () => {
    let server
    let url

    beforeAll(async () => {
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        url = `http://127.0.0.1:${server.address().port}/users`
    })

    beforeEach(() => User.deleteMany())
    afterEach(() => User.deleteMany())

    test('creates a user with a hashed password and returns 201 without a body', async () => {
        const password = 'Abc12345'
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Ana Pérez',
                email: 'ana@example.com',
                username: 'anaperez',
                password
            })
        })

        expect(response.status).toBe(201)
        expect(await response.text()).toBe('')

        const user = await User.findOne({ email: 'ana@example.com' })
        expect(user).not.toBeNull()
        expect(user.name).toBe('Ana Pérez')
        expect(user.username).toBe('anaperez')
        expect(user.password).not.toBe(password)
        expect(await bcrypt.compare(password, user.password)).toBe(true)
    })

    test('returns the existing validation error without creating a user', async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Ana',
                email: 'invalid',
                username: 'anaperez',
                password: 'Abc12345'
            })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid email syntax' })
        expect(await User.countDocuments()).toBe(0)
    })

    test('returns a conflict when the user already exists', async () => {
        await User.create({
            name: 'Ana Pérez',
            email: 'ana@example.com',
            username: 'anaperez',
            password: 'existing-hash'
        })

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Ana Pérez',
                email: 'ana@example.com',
                username: 'anaperez',
                password: 'Abc12345'
            })
        })

        expect(response.status).toBe(409)
        expect(await response.json()).toEqual({ error: 'DuplicityError', message: 'user already exists' })
        expect(await User.countDocuments()).toBe(1)
    })

    afterAll(async () => {
        try {
            if (server) {
                await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
            }
        } finally {
            await mongoose.disconnect()
        }
    })
})
