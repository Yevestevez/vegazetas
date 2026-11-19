import { z } from 'zod'

export const textSchema = z.string({ error: 'invalid text type, must be a string' })
    .refine(text => text.length >= 1 && text.length <= 5000,
        'invalid text length, must be between 1 and 5000 characters')

export const noteSchema = z.string({ error: 'invalid note type, must be a string' })
    .refine(note => note.length >= 1 && note.length <= 2000,
        'invalid note length, must be between 1 and 2000 characters')

export const stepNoteUpdateSchema = z.string({ error: 'invalid note type, must be a string' })
    .refine(note => note.length <= 2000, 'invalid note length, must be 2000 characters maximum')

export const directionSchema = z.enum(['up', 'down'], {
    error: 'direction must be "up" or "down"'
})
