import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import { errors, idSchema, validate } from 'com'
import createApp from '../app.js'

describe('shared identifier validation', () => {
    test.each([
        ['a'.repeat(24), 'recipeId'],
        ['A'.repeat(24), 'userId'],
        ['0123456789abcdef01234567', 'stepId']
    ])('accepts a 24-character hexadecimal %s value as %s without normalizing it', (id, explain) => {
        expect(idSchema(explain).parse(id)).toBe(id)
        expect(validate.id(id, explain)).toBeUndefined()
    })

    describe('GET /users/name identifier validation', () => {
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

        test('rejects a non-hexadecimal token id before database access', async () => {
            const token = jwt.sign({ sub: 'z'.repeat(24) }, secret, { expiresIn: '24h' })
            const response = await fetch(`http://127.0.0.1:${server.address().port}/users/name`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            expect(response.status).toBe(400)
            expect(await response.json()).toEqual({
                error: 'ValidationError',
                message: 'invalid userId syntax, must be a 24-character hexadecimal string'
            })
        })

        afterAll(async () => {
            if (previousSecret === undefined) delete process.env.JWT_SECRET
            else process.env.JWT_SECRET = previousSecret
            if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
        })
    })

    test.each([
        [undefined, 'recipeId', 'invalid recipeId type, must be a string'],
        [null, 'stepId', 'invalid stepId type, must be a string'],
        [5, 'userId', 'invalid userId type, must be a string'],
        ['a'.repeat(23), 'recipeId', 'invalid recipeId length, must be 24 characters'],
        ['a'.repeat(25), 'ingredientId', 'invalid ingredientId length, must be 24 characters'],
        ['z'.repeat(24), 'userId', 'invalid userId syntax, must be a 24-character hexadecimal string'],
        ['🍎'.repeat(12), 'stepId', 'invalid stepId syntax, must be a 24-character hexadecimal string']
    ])('rejects invalid identifier %s with its field-specific message', (id, explain, message) => {
        expect(idSchema(explain).safeParse(id).success).toBe(false)
        expect(() => validate.id(id, explain)).toThrowError(errors.ValidationError)
        expect(() => validate.id(id, explain)).toThrowError(message)
    })
})
