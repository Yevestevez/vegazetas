import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'

describe('POST /recipes', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server
    let baseUrl
    let user

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        await mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true })

        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        baseUrl = 'http://127.0.0.1:' + server.address().port + '/recipes'
    })

    beforeEach(async () => {
        await Promise.all([User.deleteMany(), Recipe.deleteMany()])
        user = await User.create({
            name: 'Author', email: 'author@example.invalid', username: 'author', password: 'synthetic-hash'
        })
    })

    const postRecipe = (userId, body) => {
        const token = jwt.sign({ sub: userId }, secret, { expiresIn: '24h' })
        return fetch(baseUrl, {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
    }

    test('creates a recipe with all fields and returns its id', async () => {
        const response = await postRecipe(user.id, {
            title: 'Tofu coreano',
            images: ['https://example.com/tofu.jpg'],
            description: 'Descripción de la receta',
            time: 35,
            difficulty: 'easy',
            tags: ['tofu', 'coreano']
        })

        expect(response.status).toBe(201)
        const recipeId = await response.json()
        expect(typeof recipeId).toBe('string')
        expect(recipeId.length).toBe(24)
        const recipe = await Recipe.findById(recipeId).lean()
        expect(recipe.title).toBe('Tofu coreano')
        expect(recipe.images).toEqual(['https://example.com/tofu.jpg'])
        expect(recipe.description).toBe('Descripción de la receta')
        expect(recipe.time).toBe(35)
        expect(recipe.difficulty).toBe('easy')
        expect(recipe.tags).toEqual(['tofu', 'coreano'])
        expect(recipe.author.toString()).toBe(user.id)
        expect(recipe.published).toBe(false)
    })

    test('creates a recipe with only title and sets optional fields to undefined', async () => {
        const response = await postRecipe(user.id, { title: 'Minimal recipe' })

        expect(response.status).toBe(201)
        const recipeId = await response.json()
        const recipe = await Recipe.findById(recipeId).lean()
        expect(recipe.title).toBe('Minimal recipe')
        expect(recipe.description).toBeUndefined()
        expect(recipe.time).toBeUndefined()
        expect(recipe.difficulty).toBeUndefined()
    })

    test('rejects empty title', async () => {
        const response = await postRecipe(user.id, { title: '' })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid title length, must be between 1 and 50 characters' })
    })

    test('rejects title over 50 characters', async () => {
        const response = await postRecipe(user.id, { title: 'a'.repeat(51) })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid title length, must be between 1 and 50 characters' })
    })

    test('rejects description over 500 characters', async () => {
        const response = await postRecipe(user.id, { title: 'Recipe', description: 'a'.repeat(501) })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid description length, must be 500 characters maximum' })
    })

    test('rejects time below 5 minutes', async () => {
        const response = await postRecipe(user.id, { title: 'Recipe', time: 4 })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid time, minimum 5 minutes' })
    })

    test('rejects time over 9999 minutes', async () => {
        const response = await postRecipe(user.id, { title: 'Recipe', time: 10000 })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid time, maximum 9999 minutes' })
    })

    test('rejects invalid difficulty', async () => {
        const response = await postRecipe(user.id, { title: 'Recipe', difficulty: 'hard' })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid difficulty (must be easy, medium or difficult)' })
    })

    test('returns not found for a nonexistent user', async () => {
        const response = await postRecipe(new mongoose.Types.ObjectId().toString(), { title: 'Recipe' })

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
    })

    test('returns a generic authentication error for an invalid token', async () => {
        const token = jwt.sign({ sub: user.id }, 'another-test-secret', { expiresIn: '24h' })

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Recipe' })
        })

        expect(response.status).toBe(401)
        expect(response.headers.get('www-authenticate')).toBe('Bearer')
        expect(await response.json()).toEqual({ error: 'CredentialsError', message: 'invalid credentials' })
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
