import { errors, validate } from 'com'

const { NotFoundError, SystemError, OwnershipError, ValidationError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindRecipeById = (recipeId: string) => Promise<any | null>
export type AddStep = (text: string, note?: string, image?: string) => Promise<string>
export type RemoveStep = (stepId: string) => Promise<void>
export type UpdateStep = (stepId: string, text: string, note?: unknown, image?: unknown) => Promise<void>
export type ReorderStep = (stepId: string, direction: string) => Promise<void>

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
    createAddStep: (userId: string, recipeId: string) => AddStep
): AddStepToRecipe {
    return (userId, recipeId, text, note, image) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.text(text)
        if (note) validate.note(note as string)
        if (image) validate.image(image as string)

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                const addStep = createAddStep(userId as string, recipeId as string)
                return addStep(text as string, note as string | undefined, image as string | undefined)
            })
    }
}

export function createRemoveStepFromRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    createRemoveStep: (userId: string, recipeId: string) => RemoveStep
): RemoveStepFromRecipe {
    return (userId, recipeId, stepId) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.id(stepId, 'stepId')

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                const removeStep = createRemoveStep(userId as string, recipeId as string)
                return removeStep(stepId as string)
            })
    }
}

export function createUpdateStepInRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    createUpdateStep: (userId: string, recipeId: string) => UpdateStep
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
                const updateStep = createUpdateStep(userId as string, recipeId as string)
                return updateStep(stepId as string, text as string, note, image)
            })
    }
}

export function createReorderStepInRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    createReorderStep: (userId: string, recipeId: string) => ReorderStep
): ReorderStepInRecipe {
    return (userId, recipeId, stepId, direction) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.id(stepId, 'stepId')
        validate.direction(direction)

        return commonCheck(findUserById, findRecipeById, userId, recipeId)
            .then(() => {
                const reorderStep = createReorderStep(userId as string, recipeId as string)
                return reorderStep(stepId as string, direction as string)
            })
    }
}
