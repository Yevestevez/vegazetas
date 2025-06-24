import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const removeStepFromRecipe = (userId, recipeId, stepId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')

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

            const { steps } = recipe

            const index = steps.findIndex(step => step._id.toString() === stepId)

            if (index < 0) throw new NotFoundError('step not found')

            steps.splice(index, 1)

            // Reordenar los pasos restantes
            steps.forEach((step, newIndex) => {
                step.order = newIndex
            })

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => { })
}

export default removeStepFromRecipe