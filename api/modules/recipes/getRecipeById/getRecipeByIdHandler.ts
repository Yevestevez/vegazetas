import type { RequestHandler } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'
import { errors } from 'com'
import type { GetRecipeById } from './getRecipeById.ts'

const { CredentialsError, NotFoundError, OwnershipError, SystemError, ValidationError } = errors

export const createGetRecipeByIdHandler = (
    getRecipeById: GetRecipeById
): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
        const { recipeId } = req.params
        const recipe = await getRecipeById(userId, recipeId)
        res.json(recipe)
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
            console.error('GET /recipes/:recipeId failed:', error)
            next(new SystemError('internal server error'))
        }
    }
}
