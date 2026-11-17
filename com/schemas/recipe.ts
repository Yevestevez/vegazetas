import { z } from 'zod'

export const titleSchema = z.string({ error: 'invalid title type, must be a string' })
    .min(1, 'invalid title length, must be between 1 and 200 characters')
    .refine(title => title.length <= 200, 'invalid title length, must be between 1 and 200 characters')

export const descriptionSchema = z.string({ error: 'invalid description type, must be a string' })
    .refine(description => description.length <= 5000, 'invalid description length, must be 5000 characters maximum')

export const imageSchema = z.string({ error: 'invalid image type, must be a string' })
    .refine(url => {
        try {
            const urlObj = new URL(url)
            if (!['http:', 'https:'].includes(urlObj.protocol)) return false
            const hostname = urlObj.hostname
            const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1']
            if (blockedHosts.includes(hostname)) return false
            if (/^10\.|^172\.(1[6-9]|2[0-9]|3[01])\.|^192\.168\.|^169\.254\./.test(hostname)) return false
            return true
        } catch {
            return false
        }
    }, 'invalid image URL: must be a valid HTTPS URL from a public domain')

export const difficultySchema = z.string({ error: 'invalid difficulty type, must be a string' })
    .refine(difficulty => ['easy', 'medium', 'difficult'].includes(difficulty),
        'invalid difficulty (must be easy, medium or difficult)')

export const timeSchema = z.number({ error: 'invalid time type, must be a number' })
    .refine(Number.isInteger, 'invalid time type, must be a number')
    .refine(time => time >= 5, 'invalid time, minimum 5 minutes')
    .refine(time => time <= 9999, 'invalid time, maximum 9999 minutes')

export const tagSchema = z.string().refine(tag => tag.length >= 1 && tag.length <= 30)

export const categorySchema = z.string({ error: 'invalid category type, must be a string' })
    .refine(category => ['entrante', 'principal', 'postre', 'sopa', 'ensalada', 'snack', 'bebida', 'otro'].includes(category),
        'invalid category (must be entrante, principal, postre, sopa, ensalada, snack, bebida or otro)')

export const servingsSchema = z.number({ error: 'invalid servings type, must be a number' })
    .refine(Number.isInteger, 'invalid servings type, must be an integer')
    .refine(servings => servings >= 1 && servings <= 100, 'invalid servings, must be between 1 and 100')

export const sourceSchema = z.string({ error: 'invalid source type, must be a string' })
    .refine(source => ['manual', 'ai-generated', 'url-import'].includes(source),
        'invalid source (must be manual, ai-generated or url-import)')

export const sourceUrlSchema = z.string({ error: 'invalid sourceUrl type, must be a string' })
    .refine(url => url.length <= 2000, 'invalid sourceUrl length, must be 2000 characters maximum')

export const aiNotesSchema = z.string({ error: 'invalid aiNotes type, must be a string' })
    .refine(notes => notes.length <= 2000, 'invalid aiNotes length, must be 2000 characters maximum')
