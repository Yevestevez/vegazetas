import { errors, validate } from 'com'

const { NotFoundError, SystemError } = errors

export type FindUserById = (userId: string) => Promise<{ name: string } | null>

function validateUserId(userId: unknown): asserts userId is string {
    validate.id(userId, 'userId')
}

export const createGetUserName = (findUserById: FindUserById) => (userId: unknown): Promise<string> => {
    validateUserId(userId)

    return findUserById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return user.name
        })
}
