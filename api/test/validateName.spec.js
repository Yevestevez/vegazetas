import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import jwt from 'jsonwebtoken'
import { errors, ingredientNameSchema, nameSchema, validate } from 'com'
import createApp from '../app.js'
import { registerUser } from '../modules/users/registerUser/composition.ts'
import addIngredientToRecipe from '../logic/addIngredientToRecipe.js'
import registerUserInApp from '../../app/src/logic/registerUser.js'
import addIngredientInApp from '../../app/src/logic/addIngredientToRecipe.js'

describe('shared name validation', () => {
    test.each(['A', 'a'.repeat(50), 'Ana Pérez', 'Ñoño', ' ', '\t'])('accepts a name without changing it', name => {
        expect(nameSchema.parse(name)).toBe(name)
        expect(validate.name(name)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid name type, must be a string'],
        [null, 'invalid name type, must be a string'],
        [5, 'invalid name type, must be a string'],
        ['', 'invalid name length, must be between 1 and 50 characters'],
        ['a'.repeat(51), 'invalid name length, must be between 1 and 50 characters'],
        ['🍎'.repeat(26), 'invalid name length, must be between 1 and 50 characters'],
        ['Ana-Fe', 'invalid name syntax'],
        ['José2', 'invalid name syntax'],
        ['e\u0301', 'invalid name syntax'],
        ['李', 'invalid name syntax']
    ])('rejects invalid name %s with its existing error', (name, message) => {
        expect(nameSchema.safeParse(name).success).toBe(false)
        expect(() => validate.name(name)).toThrowError(errors.ValidationError)
        expect(() => validate.name(name)).toThrowError(message)
    })

    test('rejects invalid names in registration before I/O', () => {
        expect(() => registerUser('Ana-Fe', 'test@example.com', 'testuser', 'abc12345')).toThrowError('invalid name syntax')
        expect(() => registerUserInApp('Ana-Fe', 'test@example.com', 'testuser', 'abc12345')).toThrowError('invalid name syntax')
    })

    test.each(['Tofu-vegano', 'B12 (vegano)', "O'Reilly", 'üñame 2'])(
        'accepts ingredient name %s using the ingredient form character set',
        name => {
            expect(ingredientNameSchema.parse(name)).toBe(name)
            expect(validate.ingredientName(name)).toBeUndefined()
        }
    )

    test.each([
        [undefined, 'invalid ingredient name type, must be a string'],
        ['a'.repeat(51), 'invalid ingredient name length, must be between 1 and 50 characters'],
        ['arroz*', 'invalid ingredient name syntax'],
        ['🍎', 'invalid ingredient name syntax']
    ])('rejects invalid ingredient name %s before I/O', (name, message) => {
        const id = 'a'.repeat(24)

        expect(() => addIngredientToRecipe(id, id, name, 1, 'g')).toThrowError(message)
        expect(() => addIngredientInApp(id, name, 1, 'g')).toThrowError(message)
    })

    test('preserves the different field validation order during registration', () => {
        expect(() => registerUser('', 'invalid', 'bad!', 'abc12345'))
            .toThrowError('invalid name length, must be between 1 and 50 characters')
        expect(() => registerUserInApp('', 'invalid', 'bad!', 'abc12345'))
            .toThrowError('invalid username syntax')
    })
})

describe('name HTTP validation', () => {
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

    test('returns the existing name error before other registration errors', async () => {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: '', email: 'invalid', username: 'bad!' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid name length, must be between 1 and 50 characters'
        })
    })

    test('returns the ingredient name error for an invalid ingredient', async () => {
        const id = 'a'.repeat(24)
        const token = jwt.sign({ sub: id }, secret, { expiresIn: '24h' })
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes/${id}/ingredients`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'arroz*', quantity: 1, unit: 'g' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message: 'invalid ingredient name syntax' })
    })

    afterAll(async () => {
        if (previousSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = previousSecret
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    })
})
