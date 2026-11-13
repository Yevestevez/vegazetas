import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { errors } from 'com'

const { SystemError } = errors

type AuthenticateUser = (email: unknown, password: unknown) => Promise<string>

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new SystemError('secretOrPrivateKey must have a value')

    return secret
}

export const createAuthenticateUserHandler = (authenticateUser: AuthenticateUser): RequestHandler =>
    async (req, res, next) => {
        try {
            const { email, password } = req.body
            const userId = await authenticateUser(email, password)
            const token = jwt.sign({ sub: userId }, getJwtSecret())

            res.json(token)
        } catch (error) {
            next(error)
        }
    }
