import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'

describe('PATCH /recipes/:recipeId', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server
    let baseUrl
    let author
    let otherUser
    let recipe

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        baseUrl = `http://127.0.0.1:${server.address().port}/recipes`
    })

    beforeEach(async () => {
        await Promise.all([User.deleteMany(), Recipe.deleteMany()])
        author = await User.create({
            name: 'Author', email: 'author@example.invalid', username: 'author', password: 'synthetic-hash'
        })
        otherUser = await User.create({
            name: 'Other User', email: 'other@example.invalid', username: 'otheruser', password: 'synthetic-hash'
        })
        recipe = await Recipe.create({
            author: author._id,
            title: 'Original recipe',
            description: 'Original description',
            time: 30,
            difficulty: 'easy',
            tags: ['original'],
            ingredients: [{ name: 'Carrot', quantity: 1 }],
            steps: [{ text: 'Cook', order: 0 }],
            published: false
        })
    })

    const patchRecipe = (userId, recipeId, body) => {
        const token = jwt.sign({ sub: userId }, secret, { expiresIn: '24h' })
        return fetch(`${baseUrl}/${recipeId}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
    }

    test('updates the author’s recipe without changing unrelated fields', async () => {
        const before = await Recipe.findById(recipe.id).lean()

        const response = await patchRecipe(author.id, recipe.id, {
            title: 'Updated recipe', description: 'Updated description', time: 45, difficulty: 'medium'
        })

        expect(response.status).toBe(204)
        expect(await response.text()).toBe('')
        const updated = await Recipe.findById(recipe.id).lean()
        expect(updated).toEqual({
            ...before,
            title: 'Updated recipe',
            description: 'Updated description',
            time: 45,
            difficulty: 'medium'
        })
    })

    test.each([30, 0])('removes stored time %i when the author omits it', async time => {
        await Recipe.updateOne({ _id: recipe._id }, { $set: { time } })

        const response = await patchRecipe(author.id, recipe.id, { title: 'Original recipe' })

        expect(response.status).toBe(204)
        const updated = await Recipe.findById(recipe.id).lean()
        expect(updated).not.toHaveProperty('time')
    })

    test.each([false, true])('rejects another user’s edit of a recipe with published=%s', async published => {
        await Recipe.updateOne({ _id: recipe._id }, { $set: { published } })
        const before = await Recipe.findById(recipe.id).lean()

        const response = await patchRecipe(otherUser.id, recipe.id, {
            title: 'Unauthorized edit', description: 'Changed', time: 45, difficulty: 'medium'
        })

        expect(response.status).toBe(403)
        expect(await response.json()).toEqual({ error: 'OwnershipError', message: 'user is not author of recipe' })
        expect(await Recipe.findById(recipe.id).lean()).toEqual(before)
    })

    test('rejects invalid time without modifying the recipe', async () => {
        const before = await Recipe.findById(recipe.id).lean()

        const response = await patchRecipe(author.id, recipe.id, { title: 'Updated recipe', time: 0 })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid time, minimum 5 minutes' })
        expect(await Recipe.findById(recipe.id).lean()).toEqual(before)
    })

    test('returns not found for a nonexistent recipe', async () => {
        const response = await patchRecipe(author.id, new mongoose.Types.ObjectId().toString(), { title: 'Updated recipe' })

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'recipe not found' })
    })

    test('rejects a nonexistent user without modifying the recipe', async () => {
        const before = await Recipe.findById(recipe.id).lean()

        const response = await patchRecipe(new mongoose.Types.ObjectId().toString(), recipe.id, { title: 'Updated recipe' })

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
        expect(await Recipe.findById(recipe.id).lean()).toEqual(before)
    })

    test('returns a generic authentication error for an invalid token without modifying the recipe', async () => {
        const before = await Recipe.findById(recipe.id).lean()
        const token = jwt.sign({ sub: author.id }, 'another-test-secret', { expiresIn: '24h' })

        const response = await fetch(`${baseUrl}/${recipe.id}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Updated recipe' })
        })

        expect(response.status).toBe(401)
        expect(response.headers.get('www-authenticate')).toBe('Bearer')
        expect(await response.json()).toEqual({ error: 'CredentialsError', message: 'invalid credentials' })
        expect(await Recipe.findById(recipe.id).lean()).toEqual(before)
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
