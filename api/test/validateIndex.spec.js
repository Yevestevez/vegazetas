import { describe, expect, test } from 'vitest'
import { errors, indexSchema, validate } from 'com'

describe('shared index validation', () => {
    test.each([0, 1, 25])('accepts non-negative integer %i', index => {
        expect(indexSchema().parse(index)).toBe(index)
        expect(validate.index(index)).toBeUndefined()
    })

    test.each([
        [undefined, 'imageIndex', 'imageIndex must be an integer'],
        [null, 'tagIndex', 'tagIndex must be an integer'],
        ['1', 'index', 'index must be an integer'],
        [NaN, 'index', 'index must be an integer'],
        [Infinity, 'index', 'index must be an integer'],
        [1.5, 'index', 'index must be an integer'],
        [-1, 'imageIndex', 'imageIndex must be greater than or equal to 0']
    ])('rejects invalid index %s with its field-specific message', (index, explain, message) => {
        expect(indexSchema(explain).safeParse(index).success).toBe(false)
        expect(() => validate.index(index, explain)).toThrowError(errors.ValidationError)
        expect(() => validate.index(index, explain)).toThrowError(message)
    })
})
