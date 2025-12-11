import { Recipe, User } from '../data/models.js'
import { validate, errors } from 'com'

const { NotFoundError, SystemError } = errors

const toggleFavoriteRecipe = (userId, recipeId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')

    return Promise.all([
        User.findById(userId),
        Recipe.findById(recipeId)
    ])
        .then(([user, recipe]) => {
            if (!user) throw new NotFoundError('User not found')
            if (!recipe) throw new NotFoundError('Recipe not found')

            if (!Array.isArray(user.favorites)) user.favorites = []

            if (user.favorites.includes(recipeId)) {
                user.favorites.pull(recipeId)
            } else {
                user.favorites.push(recipeId)
            }

            return user.save()
        })
        .catch(error => {
            if (error instanceof NotFoundError)
                throw error
            throw new SystemError(error.message)
        })
}

export default toggleFavoriteRecipe