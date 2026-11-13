import logic from '../../../logic/index.js'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export default (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)

        const { recipeId } = req.params

        const { text, note, image } = req.body

        logic.addStepToRecipe(
            userId,
            recipeId,
            text,
            note,
            image
        )
            .then((stepId) => res.status(201).json(stepId))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}