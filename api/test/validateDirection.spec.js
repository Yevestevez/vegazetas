import { describe, expect, test } from 'vitest'
import { directionSchema, errors, validate } from 'com'

describe('shared direction validation', () => {
    test.each(['up', 'down'])('accepts direction %s', direction => {
        expect(directionSchema.parse(direction)).toBe(direction)
        expect(validate.direction(direction)).toBeUndefined()
    })

    test.each([undefined, null, '', 'UP', 'left', 1])('rejects invalid direction %s', direction => {
        expect(directionSchema.safeParse(direction).success).toBe(false)

        let thrownError
        try {
            validate.direction(direction)
        } catch (error) {
            thrownError = error
        }

        expect(thrownError).toBeInstanceOf(Error)
        expect(thrownError).not.toBeInstanceOf(errors.ValidationError)
        expect(thrownError.message).toBe('direction must be "up" or "down"')
    })
})
