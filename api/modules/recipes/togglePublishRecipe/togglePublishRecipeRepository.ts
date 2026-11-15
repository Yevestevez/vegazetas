import { Recipe, User } from '../../../data/models.ts'
import type { FindUserById, FindAndToggleRecipe } from './togglePublishRecipe.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).exec()

export const findAndToggleRecipe: FindAndToggleRecipe = (userId, recipeId) => {
    return Recipe.findById(recipeId).exec()
        .then(recipe => {
            if (!recipe) return null
            if (recipe.author.toString() !== userId) {
                throw new Error('not owner')
            }
            recipe.published = !recipe.published
            return recipe.save()
        })
        .then(recipe => {
            if (!recipe) return null
            return { published: recipe.published }
        })
}
