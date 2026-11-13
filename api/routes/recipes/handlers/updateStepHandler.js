import logic from '../../../logic/index.js'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export default (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)

        const { recipeId, stepId } = req.params
        const { text, note, image } = req.body

        logic.updateStep(
            userId,
            recipeId,
            stepId,
            text,
            note,
            image
        )
            .then(() => res.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}