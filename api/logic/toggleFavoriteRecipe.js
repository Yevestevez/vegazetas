import { User, Recipe } from '../data/models.js'
import { validate, errors } from 'com'

const { NotFoundError, SystemError } = errors

const toggleFavoriteRecipe = (userId, recipeId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')

    return Recipe.exists({ _id: recipeId })
        .then(exists => {
            if (!exists) throw new NotFoundError('Recipe not found')

            return User.findById(userId).then(user => {
                if (!user) throw new NotFoundError('User not found')

                const isFav = user.favorites?.includes(recipeId)
                const update = isFav ? { $pull: { favorites: recipeId } }
                    : { $addToSet: { favorites: recipeId } }

                return User.updateOne({ _id: userId }, update)
            })
        })
        .catch(error => {
            if (error instanceof NotFoundError) throw error
            throw new SystemError(error.message)
        })
}

export default toggleFavoriteRecipe