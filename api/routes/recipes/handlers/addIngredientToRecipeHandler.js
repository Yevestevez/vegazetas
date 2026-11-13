import logic from '../../../logic/index.js'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export default (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)

        const { recipeId } = req.params

        const {
            name,
            quantity,
            unit,
            annotation,
            main
        } = req.body

        logic.addIngredientToRecipe(
            userId,
            recipeId,
            name,
            quantity,
            unit,
            annotation,
            main
        )
            .then((ingredientId) => res.status(201).json(ingredientId))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}