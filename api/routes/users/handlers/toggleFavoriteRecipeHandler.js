import logic from '../../../logic/index.js'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.slice(7)
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const { sub: userId } = payload

        const { recipeId } = req.params

        logic.toggleFavoriteRecipe(
            userId,
            recipeId,
        )
            .then(result => {
                const user = result.toJSON()
                delete user.password
                res.status(200).json(user)
            })
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}