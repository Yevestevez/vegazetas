import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'

describe('recipe nested elements HTTP contracts', () => {
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
        baseUrl = 'http://127.0.0.1:' + server.address().port + '/recipes'
    })

    beforeEach(async () => {
        await Promise.all([User.deleteMany(), Recipe.deleteMany()])
        author = await User.create({
            name: 'Author', email: 'author@example.invalid', username: 'author', password: 'synthetic-hash'
        })
        otherUser = await User.create({
            name: 'Other', email: 'other@example.invalid', username: 'other', password: 'synthetic-hash'
        })
        recipe = await Recipe.create({
            author: author._id,
            title: 'Recipe with elements',
            ingredients: [{ name: 'Carrot', quantity: 1 }],
            steps: [{ text: 'Cook', order: 0 }],
            images: ['https://example.com/image1.jpg'],
            tags: ['vegetarian']
        })
    })

    const authHeaders = (userId) => {
        const token = jwt.sign({ sub: userId }, secret, { expiresIn: '24h' })
        return { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
    }

    // --- Ingredients ---

    describe('ingredients', () => {
        test('adds an ingredient and returns its id', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/ingredients', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ name: 'Potato', quantity: 2, unit: 'kg' })
            })

            expect(response.status).toBe(201)
            const ingredientId = await response.json()
            expect(typeof ingredientId).toBe('string')
            expect(ingredientId.length).toBe(24)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.ingredients.length).toBe(2)
            expect(updated.ingredients[1].name).toBe('Potato')
        })

        test('rejects ingredient with invalid name', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/ingredients', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ name: '', quantity: 1 })
            })

            expect(response.status).toBe(400)
        })

        test('rejects ingredient with invalid quantity', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/ingredients', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ name: 'Potato', quantity: 0 })
            })

            expect(response.status).toBe(400)
        })

        test('removes an ingredient by its id', async () => {
            const ingredientId = recipe.ingredients[0]._id.toString()

            const response = await fetch(baseUrl + '/' + recipe.id + '/ingredients/' + ingredientId, {
                method: 'DELETE',
                headers: authHeaders(author.id)
            })

            expect(response.status).toBe(204)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.ingredients.length).toBe(0)
        })

        test('rejects ingredient operation by another user', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/ingredients', {
                method: 'POST',
                headers: authHeaders(otherUser.id),
                body: JSON.stringify({ name: 'Potato', quantity: 1 })
            })

            expect(response.status).toBe(403)
            expect(await response.json()).toEqual({ error: 'OwnershipError', message: 'user is not author of recipe' })
        })
    })

    // --- Steps ---

    describe('steps', () => {
        test('adds a step and returns its id', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/steps', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ text: 'Serve' })
            })

            expect(response.status).toBe(201)
            const stepId = await response.json()
            expect(typeof stepId).toBe('string')
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.steps.length).toBe(2)
            expect(updated.steps[1].text).toBe('Serve')
        })

        test('rejects step with empty text', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/steps', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ text: '' })
            })

            expect(response.status).toBe(400)
        })

        test('updates a step', async () => {
            const stepId = recipe.steps[0]._id.toString()

            const response = await fetch(baseUrl + '/' + recipe.id + '/steps/' + stepId, {
                method: 'PATCH',
                headers: authHeaders(author.id),
                body: JSON.stringify({ text: 'Boil', note: 'For 10 minutes' })
            })

            expect(response.status).toBe(204)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.steps[0].text).toBe('Boil')
            expect(updated.steps[0].note).toBe('For 10 minutes')
        })

        test('reorders a step', async () => {
            await Recipe.updateOne({ _id: recipe._id }, {
                $push: { steps: { text: 'Garnish', order: 1 } }
            })
            const stepId = recipe.steps[0]._id.toString()

            const response = await fetch(baseUrl + '/' + recipe.id + '/steps/' + stepId + '/reorder', {
                method: 'PATCH',
                headers: authHeaders(author.id),
                body: JSON.stringify({ direction: 'down' })
            })

            expect(response.status).toBe(204)
        })

        test('removes a step by its id', async () => {
            const stepId = recipe.steps[0]._id.toString()

            const response = await fetch(baseUrl + '/' + recipe.id + '/steps/' + stepId, {
                method: 'DELETE',
                headers: authHeaders(author.id)
            })

            expect(response.status).toBe(204)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.steps.length).toBe(0)
        })

        test('rejects step operation by another user', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/steps', {
                method: 'POST',
                headers: authHeaders(otherUser.id),
                body: JSON.stringify({ text: 'Serve' })
            })

            expect(response.status).toBe(403)
        })
    })

    // --- Images ---

    describe('images', () => {
        test('adds an image and returns 201', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/images', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ image: 'https://example.com/image2.jpg' })
            })

            expect(response.status).toBe(201)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.images).toContain('https://example.com/image2.jpg')
        })

        test('removes an image by its index', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/images/0', {
                method: 'DELETE',
                headers: authHeaders(author.id)
            })

            expect(response.status).toBe(204)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.images.length).toBe(0)
        })

        test('rejects image operation by another user', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/images', {
                method: 'POST',
                headers: authHeaders(otherUser.id),
                body: JSON.stringify({ image: 'https://example.com/other.jpg' })
            })

            expect(response.status).toBe(403)
            expect(await response.json()).toEqual({ error: 'OwnershipError', message: 'user is not author of recipe' })
        })
    })

    // --- Tags ---

    describe('tags', () => {
        test('adds a tag and returns the updated list', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/tags', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ tag: 'quick' })
            })

            expect(response.status).toBe(201)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.tags).toContain('quick')
        })

        test('rejects tag over 30 characters', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/tags', {
                method: 'POST',
                headers: authHeaders(author.id),
                body: JSON.stringify({ tag: 'a'.repeat(31) })
            })

            expect(response.status).toBe(400)
        })

        test('removes a tag by its index', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/tags/0', {
                method: 'DELETE',
                headers: authHeaders(author.id)
            })

            expect(response.status).toBe(204)
            const updated = await Recipe.findById(recipe.id).lean()
            expect(updated.tags.length).toBe(0)
        })

        test('rejects tag operation by another user', async () => {
            const response = await fetch(baseUrl + '/' + recipe.id + '/tags', {
                method: 'POST',
                headers: authHeaders(otherUser.id),
                body: JSON.stringify({ tag: 'added-by-other' })
            })

            expect(response.status).toBe(403)
            expect(await response.json()).toEqual({ error: 'OwnershipError', message: 'user is not author of recipe' })
        })
    })

    // --- Auth errors ---

    describe('authentication', () => {
        test('returns 401 for invalid token on nested operations', async () => {
            const token = jwt.sign({ sub: author.id }, 'another-test-secret', { expiresIn: '24h' })

            const response = await fetch(baseUrl + '/' + recipe.id + '/ingredients', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Potato', quantity: 1 })
            })

            expect(response.status).toBe(401)
            expect(response.headers.get('www-authenticate')).toBe('Bearer')
        })
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
