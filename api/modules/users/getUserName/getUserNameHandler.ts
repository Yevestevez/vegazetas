import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { errors } from 'com'

const { CredentialsError, NotFoundError, SystemError, ValidationError } = errors

export const createGetUserNameHandler = (
    getUserName: (userId: unknown) => Promise<string>
): RequestHandler => async (req, res, next) => {
    try {
        const authorization = req.headers.authorization?.match(/^Bearer[ \t]+(\S+)$/i)
        if (!authorization) throw new CredentialsError('invalid credentials')

        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error('JWT_SECRET is not configured')

        let payload
        try {
            payload = jwt.verify(authorization[1], secret)
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) throw new CredentialsError('invalid credentials')
            throw error
        }

        const userId = typeof payload === 'string' ? undefined : payload.sub
        const name = await getUserName(userId)

        res.json(name)
    } catch (error) {
        if (error instanceof CredentialsError) {
            res.set('WWW-Authenticate', 'Bearer')
            next(error)
        } else if (error instanceof NotFoundError || error instanceof ValidationError) {
            next(error)
        } else {
            console.error('GET /users/name failed:', error)
            next(new SystemError('internal server error'))
        }
    }
}
