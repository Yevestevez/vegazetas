import { errors, validate } from 'com'

const { NotFoundError, SystemError, OwnershipError, ValidationError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindRecipeById = (recipeId: string) => Promise<any | null>
export type AddStep = (recipeId: string, text: string, note: string, image: string) => Promise<string>
export type RemoveStep = (recipeId: string, stepId: string) => Promise<void>
export type UpdateStep = (recipeId: string, stepId: string, text: string, note: string, image: string) => Promise<void>
export type ReorderStep = (recipeId: string, stepId: string, direction: string) => Promise<void>

export type AddStepToRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    text: unknown,
    note?: unknown,
    image?: unknown
) => Promise<string>

export type RemoveStepFromRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    stepId: string | undefined
) => Promise<void>

export type UpdateStepInRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    stepId: string | undefined,
    text: unknown,
    note?: unknown,
    image?: unknown
) => Promise<void>

export type ReorderStepInRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    stepId: string | undefined,
    direction: unknown
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

export function createAddStepToRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    addStep: AddStep
): AddStepToRecipe {
    return (userId, recipeId, text, note, image) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.text(text)
        if (note) validate.note(note as string)
        if (image) validate.image(image as string)

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                return addStep(recipeId as string, text as string, (note ?? '') as string, (image ?? '') as string)
            })
    }
}

export function createRemoveStepFromRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    removeStep: RemoveStep
): RemoveStepFromRecipe {
    return (userId, recipeId, stepId) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.id(stepId, 'stepId')

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                return removeStep(recipeId as string, stepId as string)
            })
    }
}

export function createUpdateStepInRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    updateStep: UpdateStep
): UpdateStepInRecipe {
    return (userId, recipeId, stepId, text, note, image) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.id(stepId, 'stepId')
        validate.text(text)

        if (image !== undefined) {
            if (typeof image !== 'string') throw new ValidationError('invalid image type, must be a string')
            if (image !== '') validate.image(image)
        }

        if (note !== undefined) validate.noteForUpdate(note as string)

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                return updateStep(recipeId as string, stepId as string, text as string, (note ?? '') as string, (image ?? '') as string)
            })
    }
}

export function createReorderStepInRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    reorderStep: ReorderStep
): ReorderStepInRecipe {
    return (userId, recipeId, stepId, direction) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.id(stepId, 'stepId')
        validate.direction(direction)

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                return reorderStep(recipeId as string, stepId as string, direction as string)
            })
    }
}
