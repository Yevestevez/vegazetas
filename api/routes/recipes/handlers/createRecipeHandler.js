import logic from '../../../logic/index.js'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export default (req, res, next) => {
    try {
        const userId = getSessionUserId(req.headers.authorization)

        const {
            title,
            images,
            description,
            time,
            difficulty,
            tags,
            ingredients,
            steps
        } = req.body

        logic.createRecipe(
            userId,
            title,
            images,
            description,
            time,
            difficulty,
            tags,
            ingredients,
            steps
        )
            .then((recipeId) => res.status(201).json(recipeId))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}