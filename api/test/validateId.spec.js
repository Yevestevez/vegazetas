import { describe, expect, test } from 'vitest'
import { errors, idSchema, validate } from 'com'

describe('shared identifier validation', () => {
    test.each([
        ['a'.repeat(24), 'recipeId'],
        ['z'.repeat(24), 'userId'],
        ['🍎'.repeat(12), 'stepId'],
        ['!?'.repeat(12), 'customId']
    ])('accepts a 24-character %s value as %s without normalizing it', (id, explain) => {
        expect(idSchema(explain).parse(id)).toBe(id)
        expect(validate.id(id, explain)).toBeUndefined()
    })

    test.each([
        [undefined, 'recipeId', 'invalid recipeId type, must be a string'],
        [null, 'stepId', 'invalid stepId type, must be a string'],
        [5, 'userId', 'invalid userId type, must be a string'],
        ['a'.repeat(23), 'recipeId', 'invalid recipeId length, must be 24 characters'],
        ['a'.repeat(25), 'ingredientId', 'invalid ingredientId length, must be 24 characters']
    ])('rejects invalid identifier %s with its field-specific message', (id, explain, message) => {
        expect(idSchema(explain).safeParse(id).success).toBe(false)
        expect(() => validate.id(id, explain)).toThrowError(errors.ValidationError)
        expect(() => validate.id(id, explain)).toThrowError(message)
    })
})
