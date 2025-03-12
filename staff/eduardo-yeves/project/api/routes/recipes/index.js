import { Router } from 'express'
import { createRecipeHandler, getMyRecipesHandler, deleteRecipeHandler, addIngredientToRecipeHandler, removeIngredientFromRecipeHandler, updateRecipeHandler } from './handlers/index.js'

import jsonBodyParser from '../../middlewares/jsonBodyParser.js'

const router = new Router()

router.post('/', jsonBodyParser, createRecipeHandler)
router.post('/:recipeId/ingredients', jsonBodyParser, addIngredientToRecipeHandler)
router.get('/', getMyRecipesHandler)
router.delete('/:recipeId', deleteRecipeHandler)
router.delete('/:recipeId/ingredients/:ingredientId', removeIngredientFromRecipeHandler)
router.patch('/:recipeId', jsonBodyParser, updateRecipeHandler)

export default router