import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import { errors, tagSchema, validate } from 'com'
import addTagToRecipe from '../logic/addTagToRecipe.js'
import addTagInApp from '../../app/src/logic/addTagToRecipe.js'
import createApp from '../app.js'

describe('shared recipe tag validation', () => {
    test.each(['a', 'x'.repeat(30), '  ', '🍎'])('accepts a tag without changing it', tag => {
        expect(tagSchema.parse(tag)).toBe(tag)
        expect(validate.tag(tag)).toBeUndefined()
    })

    test.each([undefined, null, 0, {}, '', 'x'.repeat(31)])('rejects invalid tag %s with the existing error', tag => {
        expect(tagSchema.safeParse(tag).success).toBe(false)
        expect(() => validate.tag(tag)).toThrowError(errors.ValidationError)
        expect(() => validate.tag(tag)).toThrowError(new errors.ValidationError('each tag must have between 1 and 20 characters'))
    })

    test('rejects invalid tags in the API and frontend before any I/O', () => {
        const id = 'a'.repeat(24)
        const error = new errors.ValidationError('each tag must have between 1 and 20 characters')

        expect(() => addTagToRecipe(id, id, '')).toThrowError(error)
        expect(() => addTagInApp(id, '')).toThrowError(error)
    })
})

describe('POST /recipes/:recipeId/tags', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
    })

    test('returns the existing HTTP validation error for an invalid tag', async () => {
        const id = 'a'.repeat(24)
        const token = jwt.sign({ sub: id }, secret)
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes/${id}/tags`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag: '' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'each tag must have between 1 and 20 characters'
        })
    })

    afterAll(async () => {
        if (previousSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = previousSecret
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    })
})
