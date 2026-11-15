import type { RequestHandler } from 'express'
import { errors } from 'com'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

const { CredentialsError, NotFoundError, SystemError, ValidationError } = errors

export const createGetUserNameHandler = (
    getUserName: (userId: unknown) => Promise<string>
): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
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
