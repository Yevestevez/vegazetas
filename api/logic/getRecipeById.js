import { User, Recipe } from '../data/models.js'
import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const getRecipeById = (userId, recipeId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            if (!Array.isArray(user.favorites)) user.favorites = []
            // normalize favorites to string ids to allow reliable comparison
            user.favorites = user.favorites.map(fav => fav.toString())

            return Recipe.findById(recipeId)
                .select('-__v')
                .populate('author', 'username')
                .lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    recipe.own = recipe.author._id.toString() === userId
                    if (!recipe.own && !recipe.published) throw new OwnershipError('recipe not published')

                    recipe.id = recipe._id.toString()
                    delete recipe._id

                    if (Array.isArray(recipe.ingredients)) {
                        recipe.ingredients.forEach(ingredient => {
                            ingredient.id = ingredient._id.toString()
                            delete ingredient._id
                            delete ingredient.__v
                        })
                    }

                    if (Array.isArray(recipe.steps)) {
                        recipe.steps.forEach(step => {
                            step.id = step._id.toString()
                            delete step._id
                            delete step.__v
                        })
                    }

                    recipe.isFavorite = user.favorites.includes(recipe.id)

                    return recipe
                })
        })
}

export default getRecipeById
