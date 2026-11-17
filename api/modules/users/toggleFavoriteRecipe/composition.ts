import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createToggleFavoriteRecipe } from './toggleFavoriteRecipe.ts'

export const toggleFavoriteRecipe = createToggleFavoriteRecipe(userRepo.findUserById, recipeRepo.recipeExists)
