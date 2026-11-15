import { Router } from 'express'
import { createToggleFavoriteRecipeHandler } from './toggleFavoriteRecipeHandler.ts'
import { toggleFavoriteRecipe } from './composition.ts'

const router = Router()

router.patch('/:recipeId', createToggleFavoriteRecipeHandler(toggleFavoriteRecipe))

export default router
