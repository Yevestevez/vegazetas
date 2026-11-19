import { z } from 'zod'

export const nameSchema = z.string({ error: 'invalid name type, must be a string' })
    .refine(name => name.length >= 1 && name.length <= 50,
        'invalid name length, must be between 1 and 50 characters')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/, 'invalid name syntax')

export const usernameSchema = z.string({ error: 'invalid username type, must be a string' })
    .refine(username => username.length >= 1 && username.length <= 25,
        'invalid username length, must be between 1 and 25 characters')
    .regex(/^[a-z0-9._-]{1,25}$/,
        'invalid username syntax (solo minúsculas, números, guiones, guiones bajos o puntos, sin espacios. Máx. 25 caracteres)')

export const emailSchema = z.string({ error: 'invalid email type, must be a string' })
    .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'invalid email syntax')

export const passwordSchema = z.string({ error: 'invalid password type, must be a string' })
    .refine(password => password.length >= 8 && password.length <= 25,
        'invalid password length, must be between 8 and 25 characters')
    .regex(/^(?=\S+$)(?=.*[A-Za-z])(?=.*\d).{8,25}$/, 'invalid password syntax')

export const bioSchema = z.string({ error: 'invalid bio type, must be a string' })
    .refine(bio => bio.length <= 500, 'invalid bio length, must be 500 characters maximum')

export const avatarSchema = z.string({ error: 'invalid avatar type, must be a string' })
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
    }, 'invalid avatar URL: must be a valid HTTPS URL from a public domain')

export const socialLinksSchema = z.object({
    twitter: z.string().refine(url => url.length <= 200, 'invalid twitter URL length, max 200 characters').optional(),
    instagram: z.string().refine(url => url.length <= 200, 'invalid instagram URL length, max 200 characters').optional(),
    website: z.string().refine(url => url.length <= 200, 'invalid website URL length, max 200 characters').optional()
})
