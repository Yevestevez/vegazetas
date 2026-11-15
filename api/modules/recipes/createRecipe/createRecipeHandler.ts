import type { RequestHandler } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'
import { errors } from 'com'
import type { CreateRecipe } from './createRecipe.ts'

const { CredentialsError, NotFoundError, SystemError, ValidationError } = errors

export const createCreateRecipeHandler = (
    createRecipe: CreateRecipe
): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
        const { title, images, description, time, difficulty, tags } = req.body
        const recipeId = await createRecipe(userId, title, images, description, time, difficulty, tags)
        res.status(201).json(recipeId)
    } catch (error) {
        if (error instanceof CredentialsError) {
            res.set('WWW-Authenticate', 'Bearer')
            next(error)
        } else if (
            error instanceof NotFoundError ||
            error instanceof ValidationError
        ) {
            next(error)
        } else {
            console.error('POST /recipes failed:', error)
            next(new SystemError('internal server error'))
        }
    }
}
