import { errors, validate } from 'com'

const { DuplicityError, SystemError } = errors

type HashPassword = (password: string, rounds: number) => Promise<string>
type CreateUser = (name: string, email: string, username: string, password: string) => Promise<void>

function validateString(value: unknown, validator: (value: unknown) => void): asserts value is string {
    validator(value)
}

const errorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error)

const isDuplicateKeyError = (error: unknown): boolean =>
    typeof error === 'object' && error !== null && 'code' in error && error.code === 11000

export const createRegisterUser = (hashPassword: HashPassword, createUser: CreateUser) =>
    (name: unknown, email: unknown, username: unknown, password: unknown): Promise<void> => {
        validateString(name, validate.name)
        validateString(email, validate.email)
        validateString(username, validate.username)
        validateString(password, validate.password)

        return hashPassword(password, 10)
            .catch(error => { throw new SystemError(errorMessage(error)) })
            .then(passwordHash => createUser(name, email, username, passwordHash)
                .catch(error => {
                    if (isDuplicateKeyError(error)) throw new DuplicityError('user already exists')

                    throw new SystemError(errorMessage(error))
                }))
    }
