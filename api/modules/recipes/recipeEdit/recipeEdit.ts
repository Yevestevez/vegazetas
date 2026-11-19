import { validate, errors } from 'com'

const { NotFoundError, SystemError, OwnershipError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindRecipeById = (recipeId: string) => Promise<any | null>
export type UpdateRecipeDoc = (recipeId: string, update: { $set?: Record<string, unknown>; $unset?: Record<string, 1> }) => Promise<any>
export type DeleteRecipeDoc = (recipeId: string) => Promise<any | null>
export type CleanUserFavorites = (recipeId: string) => Promise<void>
export type CleanRecipeLikedBy = (recipeId: string) => Promise<void>

export type UpdateRecipe = (userId: unknown, recipeId: unknown, title: unknown, description?: unknown, time?: unknown, difficulty?: unknown, category?: unknown, servings?: unknown, source?: unknown, sourceUrl?: unknown, aiNotes?: unknown) => Promise<void>
export type DeleteRecipe = (userId: unknown, recipeId: unknown) => Promise<void>

function checkOwnership(authorId: string, userId: string): void {
    if (authorId !== userId) throw new OwnershipError('user is not author of recipe')
}

export function createUpdateRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    updateRecipeDoc: UpdateRecipeDoc
): UpdateRecipe {
    return (userId, recipeId, title, description, time, difficulty, category, servings, source, sourceUrl, aiNotes) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.title(title)
        if (description) validate.description(description)
        if (time !== undefined) validate.time(time)
        if (difficulty) validate.difficulty(difficulty)
        if (category) validate.category(category)
        if (servings !== undefined) validate.servings(servings)
        if (source) validate.source(source)
        if (sourceUrl) validate.sourceUrl(sourceUrl)
        if (aiNotes) validate.aiNotes(aiNotes)

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                return findRecipeById(recipeId as string)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipe => {
                        if (!recipe) throw new NotFoundError('recipe not found')

                        checkOwnership(recipe.author.toString(), userId as string)

                        const $set: Record<string, unknown> = { title: title as string }
                        const $unset: Record<string, 1> = {}

                        if (description !== undefined) {
                            $set.description = description as string
                        }
                        if (time !== undefined) {
                            $set.time = time as number
                        } else {
                            $unset.time = 1
                        }
                        if (difficulty !== undefined) {
                            $set.difficulty = difficulty as string
                        }
                        if (category !== undefined) {
                            $set.category = category as string
                        }
                        if (servings !== undefined) {
                            $set.servings = servings as number
                        } else {
                            $unset.servings = 1
                        }
                        if (source !== undefined) {
                            $set.source = source as string
                        }
                        if (sourceUrl !== undefined) {
                            $set.sourceUrl = sourceUrl as string
                        } else {
                            $unset.sourceUrl = 1
                        }
                        if (aiNotes !== undefined) {
                            $set.aiNotes = aiNotes as string
                        } else {
                            $unset.aiNotes = 1
                        }

                        const update: { $set?: Record<string, unknown>; $unset?: Record<string, 1> } = { $set }
                        if (Object.keys($unset).length > 0) {
                            update.$unset = $unset
                        }

                        return updateRecipeDoc(recipeId as string, update)
                            .catch(error => { throw new SystemError(error.message) })
                    })
            })
    }
}

export function createDeleteRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    deleteRecipeDoc: DeleteRecipeDoc,
    cleanUserFavorites: CleanUserFavorites,
    cleanRecipeLikedBy: CleanRecipeLikedBy
): DeleteRecipe {
    return (userId, recipeId) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                return findRecipeById(recipeId as string)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipe => {
                        if (!recipe) throw new NotFoundError('recipe not found')

                        checkOwnership(recipe.author.toString(), userId as string)

                        return deleteRecipeDoc(recipeId as string)
                            .then(async () => {
                                // Clean up references to this recipe in other documents
                                await Promise.all([
                                    cleanUserFavorites(recipeId as string),
                                    cleanRecipeLikedBy(recipeId as string)
                                ])
                            })
                            .catch(error => { throw new SystemError(error.message) })
                    })
            })
    }
}
