import 'dotenv/config'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'

describe('PATCH /users/favorites/:recipeId', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server
    let baseUrl

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        const app = createApp()
        server = await new Promise((resolve, reject) => {
            const listener = app.listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        baseUrl = `http://127.0.0.1:${server.address().port}`
    })

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    test('updates favorites and returns the user without the password', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.invalid',
            username: 'testuser',
            password: 'synthetic-hash'
        })
        const recipe = await Recipe.create({ author: user._id, title: 'Test Recipe' })
        const token = jwt.sign({ sub: user.id }, secret)

        const response = await fetch(`${baseUrl}/users/favorites/${recipe.id}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
        })

        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body).not.toHaveProperty('password')
        expect(body._id).toBe(user.id)
        expect(body.email).toBe(user.email)
        expect(body.username).toBe(user.username)
        expect(body.favorites).toEqual([recipe.id])
        const storedUser = await User.findById(user.id).lean()
        expect(storedUser.password).toBe('synthetic-hash')
        expect(storedUser.favorites.map(id => id.toString())).toEqual([recipe.id])
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

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
