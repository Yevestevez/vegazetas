import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'

describe('GET /recipes/:recipeId', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server
    let baseUrl
    let author
    let viewer
    let privateRecipe
    let publishedRecipe

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
        viewer = await User.create({
            name: 'Viewer', email: 'viewer@example.invalid', username: 'viewer', password: 'synthetic-hash'
        })
        privateRecipe = await Recipe.create({ author: author._id, title: 'Private recipe', published: false })
        publishedRecipe = await Recipe.create({
            author: author._id,
            title: 'Published recipe',
            published: true,
            ingredients: [{ name: 'Carrot', quantity: 1 }],
            steps: [{ text: 'Cook', order: 0 }]
        })
    })

    const getRecipe = (userId, recipeId) => {
        const token = jwt.sign({ sub: userId }, secret)
        return fetch(`${baseUrl}/${recipeId}`, { headers: { Authorization: `Bearer ${token}` } })
    }

    test('returns an unpublished recipe to its owner', async () => {
        const response = await getRecipe(author.id, privateRecipe.id)

        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body).toMatchObject({
            id: privateRecipe.id,
            title: 'Private recipe',
            author: { _id: author.id, username: author.username },
            published: false,
            own: true,
            isFavorite: false
        })
        expect(body).not.toHaveProperty('_id')
        expect(body).not.toHaveProperty('__v')
        expect(body.author).not.toHaveProperty('password')
        expect(body.author).not.toHaveProperty('email')
    })

    test('returns another user’s published recipe with nested identifiers and favorite status', async () => {
        await User.updateOne({ _id: viewer._id }, { $push: { favorites: publishedRecipe._id } })

        const response = await getRecipe(viewer.id, publishedRecipe.id)

        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body).toMatchObject({
            id: publishedRecipe.id,
            title: 'Published recipe',
            author: { _id: author.id, username: author.username },
            published: true,
            own: false,
            isFavorite: true,
            ingredients: [{ id: publishedRecipe.ingredients[0].id, name: 'Carrot', quantity: 1 }],
            steps: [{ id: publishedRecipe.steps[0].id, text: 'Cook', order: 0 }]
        })
        expect(body.ingredients[0]).not.toHaveProperty('_id')
        expect(body.steps[0]).not.toHaveProperty('_id')
        expect(body.author).not.toHaveProperty('password')
    })

    test('rejects access to another user’s unpublished recipe', async () => {
        const response = await getRecipe(viewer.id, privateRecipe.id)

        expect(response.status).toBe(403)
        expect(await response.json()).toEqual({ error: 'OwnershipError', message: 'recipe not published' })
    })

    test('returns not found when the recipe does not exist', async () => {
        const response = await getRecipe(viewer.id, new mongoose.Types.ObjectId().toString())

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'recipe not found' })
    })

    test('returns not found when the authenticated user does not exist', async () => {
        const response = await getRecipe(new mongoose.Types.ObjectId().toString(), publishedRecipe.id)

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
    })

    test('rejects a malformed recipe identifier', async () => {
        const response = await getRecipe(viewer.id, 'short')

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid recipeId length, must be 24 characters'
        })
    })

    test.each([
        ['missing authorization', () => undefined],
        ['malformed token', () => 'Bearer invalid'],
        ['invalid signature', () => `Bearer ${jwt.sign({ sub: viewer.id }, 'another-test-secret')}`],
        ['expired token', () => `Bearer ${jwt.sign({ sub: viewer.id }, secret, { expiresIn: -1 })}`],
        ['wrong authorization scheme', () => `Basic ${jwt.sign({ sub: viewer.id }, secret)}`]
    ])('returns a generic authentication error for %s', async (_description, createAuthorization) => {
        const authorization = createAuthorization()
        const headers = authorization ? { Authorization: authorization } : {}

        const response = await fetch(`${baseUrl}/${publishedRecipe.id}`, { headers })

        expect(response.status).toBe(401)
        expect(response.headers.get('www-authenticate')).toBe('Bearer')
        expect(await response.json()).toEqual({ error: 'CredentialsError', message: 'invalid credentials' })
    })

    test('returns a validation error for a signed token without a user id', async () => {
        const token = jwt.sign({}, secret)

        const response = await fetch(`${baseUrl}/${publishedRecipe.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid userId type, must be a string'
        })
    })

    test('does not expose missing server configuration as an authentication error', async () => {
        const token = jwt.sign({ sub: viewer.id }, secret)
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})
        delete process.env.JWT_SECRET

        try {
            const response = await fetch(`${baseUrl}/${publishedRecipe.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            expect(response.status).toBe(500)
            expect(await response.json()).toEqual({ error: 'SystemError', message: 'internal server error' })
            expect(log).toHaveBeenCalled()
        } finally {
            process.env.JWT_SECRET = secret
            log.mockRestore()
        }
    })

    test('does not expose a database failure', async () => {
        const findById = vi.spyOn(User, 'findById').mockReturnValue({
            lean: () => Promise.reject(new Error('database details'))
        })
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})

        try {
            const response = await getRecipe(viewer.id, publishedRecipe.id)

            expect(response.status).toBe(500)
            expect(await response.json()).toEqual({ error: 'SystemError', message: 'internal server error' })
            expect(log).toHaveBeenCalled()
        } finally {
            findById.mockRestore()
            log.mockRestore()
        }
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
