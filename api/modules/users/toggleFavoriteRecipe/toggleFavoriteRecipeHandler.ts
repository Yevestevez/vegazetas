import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { toggleFavoriteRecipe } from './composition.ts'

export const createToggleFavoriteRecipeHandler = (
    toggleFavorite: typeof toggleFavoriteRecipe
): RequestHandler => async (req, res, next) => {
    try {
        const token = req.headers.authorization!.slice(7)
        const payload = jwt.verify(token, process.env.JWT_SECRET!)
        const userId = typeof payload === 'string' ? undefined : payload.sub
        const { recipeId } = req.params
        const user = await toggleFavorite(userId, recipeId)
        const response = user.toJSON()
        delete response.password

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}
