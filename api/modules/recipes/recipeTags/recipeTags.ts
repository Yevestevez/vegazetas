import { errors, validate } from 'com'

const { NotFoundError, SystemError, OwnershipError, ValidationError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindRecipeById = (recipeId: string) => Promise<any | null>
export type AddTag = (recipeId: string, tag: string) => Promise<void>
export type RemoveTag = (recipeId: string, index: number) => Promise<void>

export type AddTagToRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    tag: unknown
) => Promise<void>

export type RemoveTagFromRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    index: string | undefined
) => Promise<void>

function commonCheck(findUserById: FindUserById, findRecipeById: FindRecipeById, userId: string | undefined, recipeId: string | undefined) {
    return findUserById(userId as string)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')
            return findRecipeById(recipeId as string)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')
                    if (recipe.author.toString() !== userId)
                        throw new OwnershipError('user is not author of recipe')
                    return recipe
                })
        })
}

export function createAddTagToRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    addTag: AddTag
): AddTagToRecipe {
    return (userId, recipeId, tag) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.tag(tag)

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(recipe => {
                if (recipe.tags.length >= 15)
                    throw new ValidationError('too many tags, max 15 allowed')
                return addTag(recipeId as string, tag as string)
            })
    }
}

export function createRemoveTagFromRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    removeTag: RemoveTag
): RemoveTagFromRecipe {
    return (userId, recipeId, index) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        const idx = Number(index)
        validate.index(idx, 'tagIndex')

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                return removeTag(recipeId as string, idx)
            })
    }
}
