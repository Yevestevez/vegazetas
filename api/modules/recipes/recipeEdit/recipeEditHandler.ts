import type { RequestHandler } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'
import { errors } from 'com'
import type { UpdateRecipe, DeleteRecipe } from './recipeEdit.ts'

const { CredentialsError, NotFoundError, OwnershipError, SystemError, ValidationError } = errors

export const createUpdateRecipeHandler = (
    updateRecipe: UpdateRecipe
): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
        const { recipeId } = req.params
        const { title, description, time, difficulty, category, servings, source, sourceUrl, aiNotes } = req.body
        await updateRecipe(userId, recipeId, title, description, time, difficulty, category, servings, source, sourceUrl, aiNotes)
        res.status(204).send()
    } catch (error) {
        if (error instanceof CredentialsError) {
            res.set('WWW-Authenticate', 'Bearer')
            next(error)
        } else if (
            error instanceof NotFoundError ||
            error instanceof OwnershipError ||
            error instanceof ValidationError
        ) {
            next(error)
        } else {
            console.error('PATCH /recipes/:recipeId failed:', error)
            next(new SystemError('internal server error'))
        }
    }
}

export const createDeleteRecipeHandler = (
    deleteRecipe: DeleteRecipe
): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
        const { recipeId } = req.params
        await deleteRecipe(userId, recipeId)
        res.status(204).send()
    } catch (error) {
        if (error instanceof CredentialsError) {
            res.set('WWW-Authenticate', 'Bearer')
            next(error)
        } else if (
            error instanceof NotFoundError ||
            error instanceof OwnershipError
        ) {
            next(error)
        } else {
            console.error('DELETE /recipes/:recipeId failed:', error)
            next(new SystemError('internal server error'))
        }
    }
}
