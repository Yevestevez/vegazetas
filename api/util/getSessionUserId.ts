import jwt from 'jsonwebtoken'
import { errors } from 'com'

const { CredentialsError, SystemError } = errors

export const getSessionUserId = (authorization: string | undefined): string => {
    const bearer = authorization?.match(/^Bearer[ \t]+(\S+)$/i)
    if (!bearer) throw new CredentialsError('invalid credentials')

    const secret = process.env.JWT_SECRET
    if (!secret) throw new SystemError('internal server error')

    let userId: unknown
    let expiration: unknown
    try {
        const payload = jwt.verify(bearer[1], secret)
        if (typeof payload !== 'string') {
            userId = payload.sub
            expiration = payload.exp
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) throw new CredentialsError('invalid credentials')
        throw error
    }

    if (typeof userId !== 'string' || typeof expiration !== 'number') {
        throw new CredentialsError('invalid credentials')
    }

    return userId
}
