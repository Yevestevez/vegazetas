import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { errors, mainSchema, quantitySchema, validate } from 'com'
import createApp from '../app.js'
import { User } from '../data/models.js'
import addIngredientToRecipe from '../logic/addIngredientToRecipe.js'
import addIngredientInApp from '../../app/src/logic/addIngredientToRecipe.js'

describe('shared ingredient field validation', () => {
    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    test.each([0.01, 1, 1.25, 9999, 1e-7])('accepts quantity %s without changing it', quantity => {
        expect(quantitySchema.parse(quantity)).toBe(quantity)
        expect(validate.quantity(quantity)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid quantity type, must be a number'],
        ['1', 'invalid quantity type, must be a number'],
        [Symbol('quantity'), 'invalid quantity type, must be a number'],
        [NaN, 'invalid quantity type, must be a number'],
        [0, 'invalid quantity, must be between 0 and 9999'],
        [-1, 'invalid quantity, must be between 0 and 9999'],
        [-1.234, 'invalid quantity, must be between 0 and 9999'],
        [10000, 'invalid quantity, must be between 0 and 9999'],
        [Infinity, 'invalid quantity, must be between 0 and 9999'],
        [-Infinity, 'invalid quantity, must be between 0 and 9999'],
        [1.234, 'invalid quantity, maximum 2 decimal places allowed'],
        [1.2e-7, 'invalid quantity, maximum 2 decimal places allowed']
    ])('rejects invalid quantity %s with its existing error', (quantity, message) => {
        expect(quantitySchema.safeParse(quantity).success).toBe(false)
        expect(() => validate.quantity(quantity)).toThrowError(errors.ValidationError)
        expect(() => validate.quantity(quantity)).toThrowError(message)
    })

    test.each([true, false])('accepts main value %s without changing it', main => {
        expect(mainSchema.parse(main)).toBe(main)
        expect(validate.main(main)).toBeUndefined()
    })

    test.each([undefined, null, 0, 'true'])('rejects invalid main value %s with its existing error', main => {
        expect(mainSchema.safeParse(main).success).toBe(false)
        expect(() => validate.main(main)).toThrowError(errors.ValidationError)
        expect(() => validate.main(main)).toThrowError('main must be a boolean (true or false)')
    })

    test.each([
        [0, true, 'invalid quantity, must be between 0 and 9999'],
        [1, 'true', 'main must be a boolean (true or false)']
    ])('rejects invalid ingredient fields in both consumers before I/O', (quantity, main, message) => {
        const id = 'a'.repeat(24)
        expect(() => addIngredientToRecipe(id, id, 'arroz', quantity, 'g', undefined, main)).toThrowError(message)
        expect(() => addIngredientInApp(id, 'arroz', quantity, 'g', undefined, main)).toThrowError(message)
    })

    test.each([undefined, false])('preserves the optional main value %s in both consumers', async main => {
        const id = 'a'.repeat(24)
        const findUser = vi.spyOn(User, 'findById').mockResolvedValue(null)
        vi.stubGlobal('sessionStorage', { token: 'test-token' })
        const fetchMock = vi.fn().mockResolvedValue({ status: 201, json: async () => 'ingredient-id' })
        vi.stubGlobal('fetch', fetchMock)

        await expect(addIngredientToRecipe(id, id, 'arroz', 1, 'g', undefined, main)).rejects.toThrow('user not found')
        await addIngredientInApp(id, 'arroz', 1, 'g', undefined, main)

        expect(findUser).toHaveBeenCalledOnce()
        expect(JSON.parse(fetchMock.mock.calls[0][1].body).main).toBe(main)
    })
})

describe('ingredient HTTP validation', () => {
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
        [{ name: 'arroz', quantity: 0, unit: 'g' }, 'invalid quantity, must be between 0 and 9999'],
        [{ name: 'arroz', quantity: 1.234, unit: 'g' }, 'invalid quantity, maximum 2 decimal places allowed'],
        [{ name: 'arroz', quantity: 1, unit: 'g', main: 'true' }, 'main must be a boolean (true or false)']
    ])('preserves the validation response for invalid ingredient fields', async (body, message) => {
        const id = 'a'.repeat(24)
        const token = jwt.sign({ sub: id }, secret)
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes/${id}/ingredients`, {
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
