import { errors, validate } from 'com'

const { NotFoundError, SystemError, OwnershipError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindAndToggleRecipe = (userId: string, recipeId: string) => Promise<{ published: boolean } | null>

export interface TogglePublishResult {
    published: boolean
}

export type TogglePublishRecipe = (userId: string | undefined, recipeId: string | undefined) => Promise<TogglePublishResult>

export function createTogglePublishRecipe(
    findUserById: FindUserById,
    findAndToggleRecipe: FindAndToggleRecipe
): TogglePublishRecipe {
    return (userId, recipeId) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('User not found')

                return findAndToggleRecipe(userId as string, recipeId as string)
                    .catch(error => {
                        if (error.message === 'not owner') throw new OwnershipError('User is not author of recipe')
                        throw new SystemError(error.message)
                    })
                    .then(result => {
                        if (!result) throw new NotFoundError('Recipe not found')
                        return result
                    })
            })
    }
}
