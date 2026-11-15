import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV !== 'production'
})

export const passwordRecoveryLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many password recovery requests, please try again later',
    keyGenerator: (req) => {
        const email = (req.body as any)?.email || ''
        return email || 'unknown'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV !== 'production'
})

export const passwordResetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Too many password reset attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV !== 'production'
})
