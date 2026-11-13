import { Recipe, User } from '../../../data/models.js'
import type { FavoriteUser } from './toggleFavoriteRecipe.ts'

export const findUserById = (userId: string): Promise<FavoriteUser | null> =>
    User.findById(userId).exec()

export const recipeExists = async (recipeId: string): Promise<boolean> =>
    (await Recipe.exists({ _id: recipeId })) !== null
