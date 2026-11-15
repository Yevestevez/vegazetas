import { Recipe, User } from '../../../data/models.js'
import type { FindUserById, FindRecipeById, AddStep, RemoveStep, UpdateStep, ReorderStep } from './recipeSteps.js'

export const findUserById: FindUserById = userId =>
    User.findById(userId).exec()

export const findRecipeById: FindRecipeById = recipeId =>
    Recipe.findById(recipeId).exec()

export function createAddStep(userId: string, recipeId: string): AddStep {
    const recipe = findRecipeById(recipeId)
    return (text, note, image) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                const newOrder = doc.steps.length
                const step = { text, note, image, order: newOrder }
                doc.steps.push(step)
                return doc.save()
            })
            .then(doc => {
                if (!doc) return null
                return doc.steps[doc.steps.length - 1]._id.toString()
            })
    }
}

export function createRemoveStep(userId: string, recipeId: string): RemoveStep {
    const recipe = findRecipeById(recipeId)
    return (stepId) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                const { steps } = doc
                const index = steps.findIndex(step => step._id.toString() === stepId)
                if (index < 0) throw new Error('step not found')
                steps.splice(index, 1)
                steps.forEach((step, newIndex) => {
                    step.order = newIndex
                })
                return doc.save()
            })
            .then(() => {})
    }
}

export function createUpdateStep(userId: string, recipeId: string): UpdateStep {
    const recipe = findRecipeById(recipeId)
    return (stepId, text, note, image) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                const stepToUpdate = doc.steps.find(step => step._id.toString() === stepId)
                if (!stepToUpdate) throw new Error('step not found')
                stepToUpdate.text = text
                stepToUpdate.note = note
                stepToUpdate.image = image
                return doc.save()
            })
            .then(() => {})
    }
}

export function createReorderStep(userId: string, recipeId: string): ReorderStep {
    const recipe = findRecipeById(recipeId)
    return (stepId, direction) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                const stepIndex = doc.steps.findIndex(step => step.id === stepId)
                if (stepIndex === -1) throw new Error('Step not found')

                if (direction === 'up' && stepIndex > 0) {
                    [doc.steps[stepIndex].order, doc.steps[stepIndex - 1].order] =
                        [doc.steps[stepIndex - 1].order, doc.steps[stepIndex].order]
                } else if (direction === 'down' && stepIndex < doc.steps.length - 1) {
                    [doc.steps[stepIndex].order, doc.steps[stepIndex + 1].order] =
                        [doc.steps[stepIndex + 1].order, doc.steps[stepIndex].order]
                }

                doc.steps.sort((a, b) => a.order - b.order)
                return doc.save()
            })
            .then(() => {})
    }
}
