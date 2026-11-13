import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { annotationSchema, errors, mainSchema, quantitySchema, unitSchema, validate } from 'com'
import createApp from '../app.js'
import { User } from '../data/models.js'
import addIngredientToRecipe from '../logic/addIngredientToRecipe.js'
import addIngredientInApp from '../../app/src/logic/addIngredientToRecipe.js'

describe('shared ingredient field validation', () => {
    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    test.each([0.01, 1, 1.25, 1e-2, 1.2e-1, 9999])('accepts quantity %s without changing it', quantity => {
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
        [1e-7, 'invalid quantity, maximum 2 decimal places allowed'],
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

    test.each(['g', 'cucharadas', 'á'.repeat(20), ' ', undefined, null])('accepts an optional unit value %s without changing it', unit => {
        expect(unitSchema.parse(unit)).toBe(unit)
        expect(validate.unit(unit)).toBeUndefined()
    })

    test.each([
        [true, 'invalid unit type, must be a string'],
        [1, 'invalid unit type, must be a string'],
        [false, 'invalid unit type, must be a string'],
        [NaN, 'invalid unit type, must be a string'],
        [Symbol('unit'), 'invalid unit type, must be a string'],
        [0, 'invalid unit type, must be a string'],
        [0n, 'invalid unit type, must be a string'],
        ['a'.repeat(21), 'invalid unit length, must be between 1 and 20 characters'],
        ['🍎'.repeat(11), 'invalid unit length, must be between 1 and 20 characters'],
        ['', 'invalid unit syntax'],
        ['g1', 'invalid unit syntax']
    ])('rejects invalid unit %s with its existing error', (unit, message) => {
        expect(unitSchema.safeParse(unit).success).toBe(false)
        expect(() => validate.unit(unit)).toThrowError(errors.ValidationError)
        expect(() => validate.unit(unit)).toThrowError(message)
    })

    test.each(['', 'x'.repeat(300), '🍎'.repeat(150), undefined, null])('accepts an optional annotation value %s without changing it', annotation => {
        expect(annotationSchema.parse(annotation)).toBe(annotation)
        expect(validate.annotation(annotation)).toBeUndefined()
    })

    test.each([
        [true, 'invalid annotation type, must be a string'],
        [1, 'invalid annotation type, must be a string'],
        [false, 'invalid annotation type, must be a string'],
        [0, 'invalid annotation type, must be a string'],
        [0n, 'invalid annotation type, must be a string'],
        [NaN, 'invalid annotation type, must be a string'],
        [Symbol('annotation'), 'invalid annotation type, must be a string'],
        ['x'.repeat(301), 'invalid annotation length, max 300 characters'],
        ['🍎'.repeat(151), 'invalid annotation length, max 300 characters']
    ])('rejects invalid annotation %s with its existing error', (annotation, message) => {
        expect(annotationSchema.safeParse(annotation).success).toBe(false)
        expect(() => validate.annotation(annotation)).toThrowError(errors.ValidationError)
        expect(() => validate.annotation(annotation)).toThrowError(message)
    })

    test.each([
        ['', 'valid', 'invalid unit syntax'],
        ['g', 'x'.repeat(301), 'invalid annotation length, max 300 characters']
    ])('rejects invalid unit or annotation in both consumers before I/O', (unit, annotation, message) => {
        const id = 'a'.repeat(24)
        expect(() => addIngredientToRecipe(id, id, 'arroz', 1, unit, annotation)).toThrowError(message)
        expect(() => addIngredientInApp(id, 'arroz', 1, unit, annotation)).toThrowError(message)
    })

    test.each([undefined, null])('preserves an optional unit and annotation value %s in both consumers', async value => {
        const id = 'a'.repeat(24)
        const findUser = vi.spyOn(User, 'findById').mockResolvedValue(null)
        vi.stubGlobal('sessionStorage', { token: 'test-token' })
        const fetchMock = vi.fn().mockResolvedValue({ status: 201, json: async () => 'ingredient-id' })
        vi.stubGlobal('fetch', fetchMock)

        await expect(addIngredientToRecipe(id, id, 'arroz', 1, value, value)).rejects.toThrow('user not found')
        await addIngredientInApp(id, 'arroz', 1, value, value)

        expect(findUser).toHaveBeenCalledOnce()
        const body = JSON.parse(fetchMock.mock.calls[0][1].body)
        expect(body.unit).toBe(value)
        expect(body.annotation).toBe(value)
    })

    test('rejects falsy non-string unit and annotation values in both consumers before I/O', () => {
        const id = 'a'.repeat(24)

        expect(() => addIngredientToRecipe(id, id, 'arroz', 1, false)).toThrowError('invalid unit type, must be a string')
        expect(() => addIngredientInApp(id, 'arroz', 1, false)).toThrowError('invalid unit type, must be a string')
        expect(() => addIngredientToRecipe(id, id, 'arroz', 1, 'g', false)).toThrowError('invalid annotation type, must be a string')
        expect(() => addIngredientInApp(id, 'arroz', 1, 'g', false)).toThrowError('invalid annotation type, must be a string')
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
        [{ name: 'arroz', quantity: 1e-7, unit: 'g' }, 'invalid quantity, maximum 2 decimal places allowed'],
        [{ name: 'arroz', quantity: 1.234, unit: 'g' }, 'invalid quantity, maximum 2 decimal places allowed'],
        [{ name: 'arroz', quantity: 1, unit: 'g', main: 'true' }, 'main must be a boolean (true or false)'],
        [{ name: 'arroz', quantity: 1, unit: '' }, 'invalid unit syntax'],
        [{ name: 'arroz', quantity: 1, unit: false }, 'invalid unit type, must be a string'],
        [{ name: 'arroz', quantity: 1, unit: 'g', annotation: false }, 'invalid annotation type, must be a string'],
        [{ name: 'arroz', quantity: 1, unit: 'g', annotation: 'x'.repeat(301) }, 'invalid annotation length, max 300 characters']
    ])('preserves the validation response for invalid ingredient fields', async (body, message) => {
        const id = 'a'.repeat(24)
        const token = jwt.sign({ sub: id }, secret, { expiresIn: '24h' })
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
