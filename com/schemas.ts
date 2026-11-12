import { z } from 'zod'

export const nameSchema = z.string({ error: 'invalid name type, must be a string' })
    .refine(name => name.length >= 1 && name.length <= 50,
        'invalid name length, must be between 1 and 50 characters')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/, 'invalid name syntax')

export const tagSchema = z.string().refine(tag => tag.length >= 1 && tag.length <= 30)

export const titleSchema = z.string({ error: 'invalid title type, must be a string' })
    .min(1, 'invalid title length, must be between 1 and 50 characters')
    .refine(title => title.length <= 50, 'invalid title length, must be between 1 and 50 characters')

export const descriptionSchema = z.string({ error: 'invalid description type, must be a string' })
    .refine(description => description.length <= 500, 'invalid description length, must be 500 characters maximum')

export const imageSchema = z.string({ error: 'invalid image type, must be a string' })
    .regex(/^https?:\/\/[^\s/$.?#].[^\s]*$/i, 'invalid image syntax, must be a valid URL')

export const difficultySchema = z.string({ error: 'invalid difficulty type, must be a string' })
    .refine(difficulty => ['easy', 'medium', 'difficult'].includes(difficulty),
        'invalid difficulty (must be easy, medium or difficult)')

export const timeSchema = z.number({ error: 'invalid time type, must be a number' })
    .refine(Number.isInteger, 'invalid time type, must be a number')
    .refine(time => time >= 5, 'invalid time, minimum 5 minutes')

export const textSchema = z.string({ error: 'invalid text type, must be a string' })
    .refine(text => text.length >= 1 && text.length <= 800,
        'invalid text length, must be between 1 and 800 characters')

export const noteSchema = z.string({ error: 'invalid note type, must be a string' })
    .refine(note => note.length >= 1 && note.length <= 500,
        'invalid note length, must be between 1 and 500 characters')

export const stepNoteUpdateSchema = z.string({ error: 'invalid note type, must be a string' })
    .refine(note => note.length <= 500, 'invalid note length, must be 500 characters maximum')

export const quantitySchema = z.custom<number>(
    value => typeof value === 'number' && !Number.isNaN(value),
    { error: 'invalid quantity type, must be a number', abort: true }
)
    .refine(quantity => quantity > 0 && quantity <= 9999, 'invalid quantity, must be between 0 and 9999')
    .refine(quantity => {
        const decimal = quantity.toString().split('.')[1]
        return !decimal || decimal.length <= 2
    }, 'invalid quantity, maximum 2 decimal places allowed')

export const mainSchema = z.boolean({ error: 'main must be a boolean (true or false)' })

// Preserve the legacy validators' acceptance of falsy non-string values.
const optionalText = (message: string) => z.union([
    z.string(), z.undefined(), z.null(), z.literal(false), z.literal(0), z.literal(0n), z.nan()
], { error: message })

export const unitSchema = optionalText('invalid unit type, must be a string')
    .refine(unit => !unit || (typeof unit === 'string' && unit.length <= 20),
        'invalid unit length, must be between 1 and 20 characters')
    .refine(unit => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(String(unit)), 'invalid unit syntax')

export const annotationSchema = optionalText('invalid annotation type, must be a string')
    .refine(annotation => !annotation || (typeof annotation === 'string' && annotation.length <= 300),
        'invalid annotation length, max 300 characters')
