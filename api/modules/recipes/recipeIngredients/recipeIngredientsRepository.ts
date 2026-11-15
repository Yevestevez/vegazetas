import { Recipe, User } from '../../../data/models.ts'
import type { FindUserById, FindRecipeById, AddIngredient, RemoveIngredient } from './recipeIngredients.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).exec()

export const findRecipeById: FindRecipeById = recipeId =>
    Recipe.findById(recipeId).exec()

export function createAddIngredient(userId: string, recipeId: string): AddIngredient {
    const recipe = findRecipeById(recipeId)
    return (name, quantity, unit, annotation, main) => {
        const ingredient = { name, quantity, unit, annotation, main }
        return recipe
            .then(doc => {
                if (!doc) return null
                doc.ingredients.push(ingredient)
                return doc.save()
            })
            .then(doc => {
                if (!doc) return null
                return doc.ingredients[doc.ingredients.length - 1]._id.toString()
            })
    }
}

export function createRemoveIngredient(userId: string, recipeId: string): RemoveIngredient {
    const recipe = findRecipeById(recipeId)
    return (ingredientId) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                const { ingredients } = doc
                const index = ingredients.findIndex((ing: any) => ing._id.toString() === ingredientId)
                if (index < 0) throw new Error('ingredient not found')
                ingredients.splice(index, 1)
                return doc.save()
            })
            .then(() => {})
    }
}
