import { errors, validate } from 'com'

const { CredentialsError, SystemError } = errors

export type UserCredentials = {
    _id: { toString: () => string }
    password: string
}

export type FindUserByEmail = (email: string) => Promise<UserCredentials | null>
type ComparePassword = (password: string, hash: string) => Promise<boolean>

function validateString(value: unknown, validator: (value: unknown) => void): asserts value is string {
    validator(value)
}

const errorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error)

export const createAuthenticateUser = (
    findUserByEmail: FindUserByEmail,
    comparePassword: ComparePassword
) => (email: unknown, password: unknown): Promise<string> => {
    validateString(email, validate.email)
    validateString(password, validate.password)

    return findUserByEmail(email)
        .catch(error => { throw new SystemError(errorMessage(error)) })
        .then(user => {
            if (!user) throw new CredentialsError('wrong credentials')

            return comparePassword(password, user.password)
                .catch(error => { throw new SystemError(errorMessage(error)) })
                .then(matches => {
                    if (!matches) throw new CredentialsError('wrong credentials')

                    return user._id.toString()
                })
        })
}
