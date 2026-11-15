import { createToggleFavoriteRecipe } from './toggleFavoriteRecipe.ts'
import { findUserById, recipeExists } from './userRepository.ts'

export const toggleFavoriteRecipe = createToggleFavoriteRecipe(findUserById, recipeExists)
