import { errors, validate } from 'com'

const { NotFoundError, SystemError, OwnershipError, ValidationError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindRecipeById = (recipeId: string) => Promise<any | null>
export type AddImage = (recipeId: string, image: string) => Promise<void>
export type RemoveImage = (recipeId: string, index: number) => Promise<void>

export type AddImageToRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    image: unknown
) => Promise<void>

export type RemoveImageFromRecipe = (
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

export function createAddImageToRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    addImage: AddImage
): AddImageToRecipe {
    return (userId, recipeId, image) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.image(image)

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(recipe => {
                if (recipe.images.length >= 15)
                    throw new ValidationError('too many tags, max 15 allowed')
                return addImage(recipeId as string, image as string)
            })
    }
}

export function createRemoveImageFromRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    removeImage: RemoveImage
): RemoveImageFromRecipe {
    return (userId, recipeId, index) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        const idx = Number(index)
        validate.index(idx, 'imageIndex')

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                return removeImage(recipeId as string, idx)
            })
    }
}
