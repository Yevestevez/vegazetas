import type { RequestHandler } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'
import { toggleFavoriteRecipe } from './composition.ts'

export const createToggleFavoriteRecipeHandler = (
    toggleFavorite: typeof toggleFavoriteRecipe
): RequestHandler => async (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)
        const { recipeId } = req.params
        const user = await toggleFavorite(userId, recipeId)
        const response = user.toJSON()
        delete response.password

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}
