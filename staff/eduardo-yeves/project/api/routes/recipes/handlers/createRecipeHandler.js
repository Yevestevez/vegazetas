import logic from '../../../logic/index.js'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.slice(7)

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const { sub: userId } = payload

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