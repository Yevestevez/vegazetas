import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'

describe('recipe list HTTP contracts', () => {
    const secret = 'local-disposable-test-secret'
    const endpoints = ['my-recipes', 'published-recipes', 'favorites-recipes']
    let previousSecret
    let server
    let baseUrl
    let viewer
    let author
    let ownDraft
    let ownPublished
    let otherDraft
    let otherPublished
    let otherOlder

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
        viewer = await User.create({
            name: 'Viewer', email: 'viewer@example.invalid', username: 'viewer', password: 'synthetic-hash'
        })
        author = await User.create({
            name: 'Author', email: 'author@example.invalid', username: 'author', password: 'synthetic-hash'
        })
        ;[ownDraft, ownPublished, otherDraft, otherPublished, otherOlder] = await Recipe.create([
            { author: viewer._id, title: 'Own draft', published: false, date: new Date('2026-01-01T00:00:00Z') },
            { author: viewer._id, title: 'Own published', published: true, date: new Date('2026-01-03T00:00:00Z') },
            { author: author._id, title: 'Other draft', published: false, date: new Date('2026-01-05T00:00:00Z') },
            { author: author._id, title: 'Other published', published: true, date: new Date('2026-01-04T00:00:00Z'), description: 'not in list' },
            { author: author._id, title: 'Other older', published: true, date: new Date('2026-01-02T00:00:00Z') }
        ])
        await User.updateOne({ _id: viewer._id }, {
            $set: { favorites: [ownDraft._id, otherDraft._id, otherPublished._id, new mongoose.Types.ObjectId()] }
        })
    })

    const getList = (endpoint, userId) => {
        const token = jwt.sign({ sub: userId }, secret)
        return fetch(`${baseUrl}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
    }

    test('returns only the user’s recipes, including drafts, in descending date order', async () => {
        const response = await getList('my-recipes', viewer.id)

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual([
            {
                id: ownPublished.id, title: 'Own published', images: [], date: '2026-01-03T00:00:00.000Z',
                author: { id: viewer.id, username: 'viewer' }, published: true, own: true, isFavorite: false
            },
            {
                id: ownDraft.id, title: 'Own draft', images: [], date: '2026-01-01T00:00:00.000Z',
                author: { id: viewer.id, username: 'viewer' }, published: false, own: true, isFavorite: true
            }
        ])
    })

    test('returns only other users’ published recipes with favorite flags in descending date order', async () => {
        const response = await getList('published-recipes', viewer.id)

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual([
            {
                id: otherPublished.id, title: 'Other published', images: [], date: '2026-01-04T00:00:00.000Z',
                author: { id: author.id, username: 'author' }, published: true, own: false, isFavorite: true
            },
            {
                id: otherOlder.id, title: 'Other older', images: [], date: '2026-01-02T00:00:00.000Z',
                author: { id: author.id, username: 'author' }, published: true, own: false, isFavorite: false
            }
        ])
    })

    test('returns favorites visible to the user, including their own draft, in descending date order', async () => {
        const response = await getList('favorites-recipes', viewer.id)

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual([
            {
                id: otherPublished.id, title: 'Other published', images: [], date: '2026-01-04T00:00:00.000Z',
                author: { id: author.id, username: 'author' }, published: true, own: false, isFavorite: true
            },
            {
                id: ownDraft.id, title: 'Own draft', images: [], date: '2026-01-01T00:00:00.000Z',
                author: { id: viewer.id, username: 'viewer' }, published: false, own: true, isFavorite: true
            }
        ])
    })

    test.each(endpoints)('%s returns an empty list when no recipes exist', async endpoint => {
        await Recipe.deleteMany()

        const response = await getList(endpoint, viewer.id)

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual([])
    })

    test.each(endpoints)('%s rejects a nonexistent user', async endpoint => {
        const response = await getList(endpoint, new mongoose.Types.ObjectId().toString())

        expect(response.status).toBe(404)
        expect(await response.json()).toEqual({ error: 'NotFoundError', message: 'user not found' })
    })

    test.each(endpoints)('%s rejects a malformed user id', async endpoint => {
        const response = await getList(endpoint, 'short')

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid userId length, must be 24 characters'
        })
    })

    const invalidCredentials = [
        ['missing authorization', () => undefined],
        ['malformed token', () => 'Bearer invalid'],
        ['invalid signature', () => `Bearer ${jwt.sign({ sub: viewer.id }, 'another-test-secret')}`],
        ['expired token', () => `Bearer ${jwt.sign({ sub: viewer.id }, secret, { expiresIn: -1 })}`],
        ['wrong authorization scheme', () => `Basic ${jwt.sign({ sub: viewer.id }, secret)}`]
    ]

    test.each(endpoints.flatMap(endpoint => invalidCredentials.map(([description, createAuthorization]) =>
        [endpoint, description, createAuthorization]
    )))('%s returns a generic authentication error for %s', async (endpoint, _description, createAuthorization) => {
        const authorization = createAuthorization()
        const headers = authorization ? { Authorization: authorization } : {}

        const response = await fetch(`${baseUrl}/${endpoint}`, { headers })

        expect(response.status).toBe(401)
        expect(response.headers.get('www-authenticate')).toBe('Bearer')
        expect(await response.json()).toEqual({ error: 'CredentialsError', message: 'invalid credentials' })
    })

    test.each(endpoints)('%s treats missing server configuration as an internal error', async endpoint => {
        const token = jwt.sign({ sub: viewer.id }, secret)
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})
        delete process.env.JWT_SECRET

        try {
            const response = await fetch(`${baseUrl}/${endpoint}`, {
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

    test.each(endpoints)('%s does not expose database failures', async endpoint => {
        const findById = vi.spyOn(User, 'findById').mockRejectedValue(new Error('database details'))
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})

        try {
            const response = await getList(endpoint, viewer.id)

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
