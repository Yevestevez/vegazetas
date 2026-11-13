import { errors, validate } from 'com'

const { NotFoundError, SystemError } = errors

export type FindUserUsernameById = (userId: string) => Promise<{ username: string } | null>

function validateUserId(userId: unknown): asserts userId is string {
    validate.id(userId, 'userId')
}

export const createGetUserUsername = (findUserUsernameById: FindUserUsernameById) =>
    (userId: unknown): Promise<string> => {
        validateUserId(userId)

        return findUserUsernameById(userId)
            .catch(error => {
                throw new SystemError(error instanceof Error ? error.message : String(error))
            })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                return user.username
            })
    }
