import { Recipe, User } from '../data/models.js'
import { validate, errors } from 'com'

const { NotFoundError, SystemError, OwnershipError } = errors

const togglePublishRecipe = (userId, recipeId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')

    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError('User not found')

            return Recipe.findById(recipeId)
        })
        .then(recipe => {
            if (!recipe) throw new NotFoundError('Recipe not found')
            if (recipe.author.toString() !== userId)
                throw new OwnershipError('User is not author of recipe')

            recipe.published = !recipe.published
            return recipe.save()
        })
        .then(recipe => ({ published: recipe.published }))
        .catch(error => {
            if (error instanceof NotFoundError || error instanceof OwnershipError)
                throw error
            throw new SystemError(error.message)
        })
}

export default togglePublishRecipe