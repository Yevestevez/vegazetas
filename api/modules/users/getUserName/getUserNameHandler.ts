import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

export const createGetUserNameHandler = (
    getUserName: (userId: unknown) => Promise<string>
): RequestHandler => (req, res, next) => {
    try {
        // Keep the existing error responses for missing credentials or secret.
        const token = req.headers.authorization!.slice(7)
        const payload = jwt.verify(token, process.env.JWT_SECRET!)
        const userId = typeof payload === 'string' ? undefined : payload.sub

        getUserName(userId)
            .then(name => res.json(name))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}
