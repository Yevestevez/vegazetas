import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'

describe('DELETE /recipes/:recipeId', () => {
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
            title: 'Recipe to delete',
            published: false
        })
    })

    const deleteRecipe = (userId, recipeId) => {
        const token = jwt.sign({ sub: userId }, secret, { expiresIn: '24h' })
        return fetch(baseUrl + '/' + recipeId, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + token }
        })
    }

    test('deletes the author\'s recipe', async () => {
        const response = await deleteRecipe(author.id, recipe.id)

        expect(response.status).toBe(204)
        expect(await Recipe.findById(recipe.id)).toBeNull()
    })

    test('rejects deletion by another user', async () => {
        const response = await deleteRecipe(otherUser.id, recipe.id)

        expect(response.status).toBe(403)
        expect(await response.json()).toEqual({ error: 'OwnershipError', message: 'user is not author of recipe' })
        expect(await Recipe.findById(recipe.id)).not.toBeNull()
    })

    test('returns not found for a nonexistent recipe', async () => {
        const response = await deleteRecipe(author.id, new mongoose.Types.ObjectId().toString())

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'recipe not found' })
    })

    test('returns not found for a nonexistent user', async () => {
        const response = await deleteRecipe(new mongoose.Types.ObjectId().toString(), recipe.id)

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
        expect(await Recipe.findById(recipe.id)).not.toBeNull()
    })

    test('returns a generic authentication error for an invalid token', async () => {
        const token = jwt.sign({ sub: author.id }, 'another-test-secret', { expiresIn: '24h' })

        const response = await fetch(baseUrl + '/' + recipe.id, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + token }
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
