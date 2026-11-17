import { z } from 'zod'

export const idSchema = (explain = 'id') => z.string({
    error: `invalid ${explain} type, must be a string`
})
    .refine(id => id.length === 24, `invalid ${explain} length, must be 24 characters`)
    .regex(/^[a-fA-F0-9]{24}$/, `invalid ${explain} syntax, must be a 24-character hexadecimal string`)

export const indexSchema = (explain = 'index') => z.custom<number>(
    Number.isInteger,
    { error: `${explain} must be an integer`, abort: true }
).refine(index => index >= 0, `${explain} must be greater than or equal to 0`)

export const commentSchema = z.object({
    user: z.string({ error: 'invalid comment user type, must be a string' })
        .refine(id => id.length === 24, 'invalid comment user id, must be 24 characters')
        .regex(/^[a-fA-F0-9]{24}$/, 'invalid comment user id syntax'),
    text: z.string({ error: 'invalid comment text type, must be a string' })
        .refine(text => text.length >= 1 && text.length <= 1000,
            'invalid comment text length, must be between 1 and 1000 characters'),
    parentId: z.union([
        z.string().refine(id => id.length === 24, 'invalid comment parentId, must be 24 characters')
            .regex(/^[a-fA-F0-9]{24}$/, 'invalid comment parentId syntax'),
        z.null()
    ]).optional()
})

export const nutritionSchema = z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional()
})
