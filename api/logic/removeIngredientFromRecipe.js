import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const removeIngredientFromRecipe = (userId, recipeId, ingredientId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.id(ingredientId, 'ingredientId')

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

            const { ingredients } = recipe

            const index = ingredients.findIndex(ingredient => ingredient._id.toString() === ingredientId)

            if (index < 0) throw new NotFoundError('ingredient not found')

            ingredients.splice(index, 1)

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => { })
}

export default removeIngredientFromRecipe