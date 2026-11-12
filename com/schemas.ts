import { z } from 'zod'

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
