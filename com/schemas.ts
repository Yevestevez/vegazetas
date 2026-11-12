import { z } from 'zod'

export const tagSchema = z.string().min(1).max(30)
