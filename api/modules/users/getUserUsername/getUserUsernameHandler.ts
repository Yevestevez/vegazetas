import type { RequestHandler } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

type GetUserUsername = (userId: unknown) => Promise<string>

export const createGetUserUsernameHandler = (
    getUserUsername: GetUserUsername
): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
        const username = await getUserUsername(userId)

        res.json(username)
    } catch (error) {
        next(error)
    }
}
