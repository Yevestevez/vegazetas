import { errors, validate } from 'com'

const { NotFoundError, SystemError } = errors

export type FindUserById = (userId: string) => Promise<{ name: string } | null>

export const createGetUserName = (findUserById: FindUserById) => (userId: string): Promise<string> => {
    validate.id(userId, 'userId')

    return findUserById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return user.name
        })
}
