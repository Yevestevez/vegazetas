import OwnershipError from 'com/errors/OwnershipError.js'
import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const deleteRecipe = (userId, recipeId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    if (recipe.author.toString() !== userId) throw new OwnershipError('user is not author of recipe')

                    return recipe.deleteOne({ _id: recipe._id })
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(recipe => { })
}

export default deleteRecipe