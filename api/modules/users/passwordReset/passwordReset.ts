import mongoose from 'mongoose'
import { errors, validate } from 'com'

const { NotFoundError, SystemError, ValidationError } = errors

export type ResetUser = {
    password: string
    save: () => Promise<unknown>
}

type FindUserById = (userId: unknown) => Promise<ResetUser | null>
type HashPassword = (password: string, rounds: number) => Promise<string>
type ResetPayload = { sub?: unknown } | string
type VerifyToken = (token: string) => ResetPayload

function validateString(value: unknown, validator: (value: unknown) => void): asserts value is string {
    validator(value)
}

const errorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error)

export const createPasswordReset = (
    findUserById: FindUserById,
    hashPassword: HashPassword,
    verifyToken: VerifyToken
) => (token: unknown, newPassword: unknown): Promise<void> => {
    validateString(newPassword, validate.password)

    let payload: ResetPayload
    try {
        if (typeof token !== 'string') throw new Error('invalid token type')
        payload = verifyToken(token)
    } catch {
        throw new ValidationError('Invalid or expired token')
    }

    const userId = typeof payload === 'string' ? undefined : payload.sub

    return findUserById(userId)
        .then(user => {
            if (!user) throw new NotFoundError('User not found')

            return hashPassword(newPassword, 10)
                .then(hash => {
                    user.password = hash
                    return user.save()
                })
                .then(() => undefined)
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof NotFoundError) throw error
            if (error instanceof mongoose.Error.ValidationError) {
                throw new ValidationError(error.message)
            }

            throw new SystemError(errorMessage(error))
        })
}
