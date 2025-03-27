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

            return Recipe.findById(recipeId).select('-__v').lean()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => {
            if (!recipe) throw new NotFoundError('recipe not found')

            if (recipe.author.toString() !== userId) throw new OwnershipError('user is not author of recipe')

            if (recipe._id) {
                recipe.id = recipe._id.toString()

                delete recipe._id
            }

            if (recipe.author._id) {
                recipe.author = recipe.author._id.toString()

                delete recipe.author._id
            }

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

            recipe.own = userId === recipe.author

            return recipe
        })
}

export default getRecipeById