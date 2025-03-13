import { Router } from 'express'

import { createRecipeHandler, getMyRecipesHandler, deleteRecipeHandler, addIngredientToRecipeHandler, removeIngredientFromRecipeHandler, updateRecipeHandler, addStepToRecipeHandler } from './handlers/index.js'

import jsonBodyParser from '../../middlewares/jsonBodyParser.js'

const router = new Router()

router.post('/', jsonBodyParser, createRecipeHandler)
router.delete('/:recipeId', deleteRecipeHandler)
router.patch('/:recipeId', jsonBodyParser, updateRecipeHandler)
router.get('/', getMyRecipesHandler)

router.post('/:recipeId/ingredients', jsonBodyParser, addIngredientToRecipeHandler)
router.delete('/:recipeId/ingredients/:ingredientId', removeIngredientFromRecipeHandler)

router.post('/:recipeId/steps', jsonBodyParser, addStepToRecipeHandler)

export default router