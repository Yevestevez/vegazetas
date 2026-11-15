import type { RequestHandler } from 'express'
import { errors } from 'com'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'
import type { GetRecipeList } from './recipeList.ts'

const { CredentialsError, DuplicityError, NotFoundError, OwnershipError, SystemError, ValidationError } = errors

export const createRecipeListHandler = (getRecipes: GetRecipeList): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
        const recipes = await getRecipes(userId)

        res.json(recipes)
    } catch (error) {
        if (error instanceof CredentialsError) {
            res.set('WWW-Authenticate', 'Bearer')
            next(error)
        } else if (
            error instanceof DuplicityError ||
            error instanceof NotFoundError ||
            error instanceof OwnershipError ||
            error instanceof ValidationError
        ) {
            next(error)
        } else {
            console.error('GET recipe list failed:', error)
            next(new SystemError('internal server error'))
        }
    }
}
