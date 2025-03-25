import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const getRecipeById = (userId, recipeId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => {
            if (!recipe) throw new NotFoundError('recipe not found')

            if (recipe.author.toString() !== userId) throw new OwnershipError('user is not author of recipe')

            recipe.id = recipe._id.toString()
            delete recipe._id
            delete recipe.__v

            if (recipe.author._id) {
                recipe.author.id = recipe.author._id.toString()

                delete recipe.author._id
            }

            recipe.own = userId === recipe.author.id

            return recipe
        })
}

export default getRecipeById