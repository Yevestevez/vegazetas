import type { RequestHandler } from 'express'

type PasswordRecover = (email: unknown) => Promise<void>

export const createPasswordRecoverHandler = (passwordRecover: PasswordRecover): RequestHandler =>
    async (req, res, next) => {
        try {
            const { email } = req.body
            await passwordRecover(email)
            res.status(200).json({ message: 'Correo de recuperación enviado' })
        } catch (error) {
            next(error)
        }
    }
