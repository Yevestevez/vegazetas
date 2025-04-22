import logic from '../../../logic/index.js'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.slice(7)

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const { sub: userId } = payload

        const { recipeId } = req.params

        const { image } = req.body

        logic.addImageToRecipe(
            userId,
            recipeId,
            image
        )
            .then(() => res.status(201).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}