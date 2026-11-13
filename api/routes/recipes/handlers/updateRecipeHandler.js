import logic from '../../../logic/index.js'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export default (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)

        const { recipeId } = req.params

        const {
            title,
            description,
            time,
            difficulty,
        } = req.body

        logic.updateRecipe(
            userId,
            recipeId,
            title,
            description,
            time,
            difficulty,
        )
            .then(() => res.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}