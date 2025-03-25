import { Router } from 'express'

import {
    createRecipeHandler,
    getMyRecipesHandler,
    deleteRecipeHandler,
    updateRecipeHandler,
    getRecipeByIdHandler,

    addIngredientToRecipeHandler,
    removeIngredientFromRecipeHandler,

    addStepToRecipeHandler,
    removeStepFromRecipeHandler
} from './handlers/index.js'

import jsonBodyParser from '../../middlewares/jsonBodyParser.js'

const router = new Router()

router.post('/', jsonBodyParser, createRecipeHandler)
router.delete('/:recipeId', deleteRecipeHandler)
router.patch('/:recipeId', jsonBodyParser, updateRecipeHandler)
router.get('/', getMyRecipesHandler)
router.get('/:recipeId', getRecipeByIdHandler)

router.post('/:recipeId/ingredients', jsonBodyParser, addIngredientToRecipeHandler)
router.delete('/:recipeId/ingredients/:ingredientId', removeIngredientFromRecipeHandler)

router.post('/:recipeId/steps', jsonBodyParser, addStepToRecipeHandler)
router.delete('/:recipeId/steps/:stepId', removeStepFromRecipeHandler)

export default router