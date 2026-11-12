import jwt from 'jsonwebtoken'
import { errors } from 'com'

const { CredentialsError } = errors

export const getSessionUserId = (authorization: string | undefined): unknown => {
    const bearer = authorization?.match(/^Bearer[ \t]+(\S+)$/i)
    if (!bearer) throw new CredentialsError('invalid credentials')

    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not configured')

    let payload
    try {
        payload = jwt.verify(bearer[1], secret)
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) throw new CredentialsError('invalid credentials')
        throw error
    }

    return typeof payload === 'string' ? undefined : payload.sub
}
