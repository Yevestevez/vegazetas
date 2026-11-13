import logic from '../../../logic/index.js'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export default (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)

        const { recipeId } = req.params

        logic.togglePublishRecipe(
            userId,
            recipeId,
        )
            .then(result => res.status(200).json(result))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}