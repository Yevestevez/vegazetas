import logic from '../../../logic/index.js'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.slice(7)

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const { sub: userId } = payload

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