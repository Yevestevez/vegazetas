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
        const userObj = user.toJSON()
        const { _id, name, email, username, favorites } = userObj
        res.status(200).json({ _id, name, email, username, favorites })
    } catch (error) {
        next(error)
    }
}
