import type { RequestHandler } from 'express'
import { passwordReset } from './composition.ts'

export const createPasswordResetHandler = (resetPassword: typeof passwordReset): RequestHandler =>
    async (req, res, next) => {
        try {
            const { token } = req.params
            const { newPassword } = req.body

            await resetPassword(token, newPassword)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
