import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const removeTagFromRecipe = (userId, recipeId, index) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    // validate.index(index, 'index')

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

            if (index === -1) throw new NotFoundError('tag not found')

            recipe.tags.splice(index, 1)

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(() => { })
}

export default removeTagFromRecipe