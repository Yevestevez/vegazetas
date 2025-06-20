import { Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const reorderStep = (
    recipeId,
    stepId,
    direction
) => {
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')

    return Recipe.findById(recipeId)
        .catch(error => { throw new SystemError(error.message) })
        .then(recipe => {
            if (!recipe) throw new NotFoundError('Recipe not found')

            const stepIndex = recipe.steps.findIndex(step => step.id === stepId)
            if (stepIndex === -1) throw new NotFoundError('Step not found')

            if (direction === 'up' && stepIndex > 0) {
                [recipe.steps[stepIndex].order, recipe.steps[stepIndex - 1].order] =
                    [recipe.steps[stepIndex - 1].order, recipe.steps[stepIndex].order]
            } else if (direction === 'down' && stepIndex < recipe.steps.length - 1) {
                [recipe.steps[stepIndex].order, recipe.steps[stepIndex + 1].order] =
                    [recipe.steps[stepIndex + 1].order, recipe.steps[stepIndex].order]
            }

            recipe.steps.sort((a, b) => a.order - b.order)

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => { })
}

export default reorderStep