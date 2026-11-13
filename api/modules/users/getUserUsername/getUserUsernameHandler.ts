import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

type GetUserUsername = (userId: unknown) => Promise<string>

export const createGetUserUsernameHandler = (
    getUserUsername: GetUserUsername
): RequestHandler => async (req, res, next) => {
    try {
        const token = req.headers.authorization!.slice(7)
        const payload = jwt.verify(token, process.env.JWT_SECRET!)
        const userId = typeof payload === 'string' ? undefined : payload.sub
        const username = await getUserUsername(userId)

        res.json(username)
    } catch (error) {
        next(error)
    }
}
