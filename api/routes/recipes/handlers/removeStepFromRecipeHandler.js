import logic from '../../../logic/index.js'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export default (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)

        const { recipeId, stepId } = req.params

        logic.removeStepFromRecipe(userId, recipeId, stepId)
            .then(() => res.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}