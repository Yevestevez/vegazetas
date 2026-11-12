import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import { descriptionSchema, errors, titleSchema, validate } from 'com'
import createApp from '../app.js'
import createRecipe from '../logic/createRecipe.js'
import updateRecipe from '../logic/updateRecipe.js'
import createRecipeInApp from '../../app/src/logic/createRecipe.js'
import updateRecipeInApp from '../../app/src/logic/updateRecipe.js'

describe('shared recipe field validation', () => {
    test.each(['a', 'x'.repeat(50), '  ', '🍎'.repeat(25)])('accepts a title without changing it', title => {
        expect(titleSchema.parse(title)).toBe(title)
        expect(validate.title(title)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid title type, must be a string'],
        [null, 'invalid title type, must be a string'],
        [5, 'invalid title type, must be a string'],
        ['', 'invalid title length, must be between 1 and 50 characters'],
        ['🍎'.repeat(26), 'invalid title length, must be between 1 and 50 characters']
    ])('rejects invalid title %s with its existing error', (title, message) => {
        expect(titleSchema.safeParse(title).success).toBe(false)
        expect(() => validate.title(title)).toThrowError(errors.ValidationError)
        expect(() => validate.title(title)).toThrowError(message)
    })

    test.each(['', 'x'.repeat(500), '🍎'.repeat(250)])('accepts a description without changing it', description => {
        expect(descriptionSchema.parse(description)).toBe(description)
        expect(validate.description(description)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid description type, must be a string'],
        [null, 'invalid description type, must be a string'],
        [5, 'invalid description type, must be a string'],
        ['x'.repeat(501), 'invalid description length, must be 500 characters maximum'],
        ['🍎'.repeat(251), 'invalid description length, must be 500 characters maximum']
    ])('rejects invalid description %s with its existing error', (description, message) => {
        expect(descriptionSchema.safeParse(description).success).toBe(false)
        expect(() => validate.description(description)).toThrowError(errors.ValidationError)
        expect(() => validate.description(description)).toThrowError(message)
    })

    test.each([
        ['', undefined, 'invalid title length, must be between 1 and 50 characters'],
        ['valid', 'x'.repeat(501), 'invalid description length, must be 500 characters maximum']
    ])('rejects invalid recipe fields in creation and editing before I/O', (title, description, message) => {
        const id = 'a'.repeat(24)
        expect(() => createRecipe(id, title, undefined, description)).toThrowError(message)
        expect(() => updateRecipe(id, id, title, description)).toThrowError(message)
        expect(() => createRecipeInApp(id, title, undefined, description)).toThrowError(message)
        expect(() => updateRecipeInApp(id, title, description)).toThrowError(message)
    })
})

describe('POST /recipes', () => {
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

    test.each([
        [{ title: '' }, 'invalid title length, must be between 1 and 50 characters'],
        [{ title: 'valid', description: 'x'.repeat(501) }, 'invalid description length, must be 500 characters maximum']
    ])('preserves HTTP validation errors for invalid recipe fields', async (body, message) => {
        const token = jwt.sign({ sub: 'a'.repeat(24) }, secret)
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message })
    })

    afterAll(async () => {
        if (previousSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = previousSecret
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    })
})
