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
    removeStepFromRecipeHandler,
    reorderStepHandler,
    updateStepHandler,

    addImageToRecipeHandler,
    removeImageFromRecipeHandler,

    addTagToRecipeHandler,
    removeTagFromRecipeHandler
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
router.patch('/:recipeId/steps/:stepId/reorder', jsonBodyParser, reorderStepHandler)
router.patch('/:recipeId/steps/:stepId', jsonBodyParser, updateStepHandler)

router.post('/:recipeId/images', jsonBodyParser, addImageToRecipeHandler)
router.delete('/:recipeId/images/:index', removeImageFromRecipeHandler)

router.post('/:recipeId/tags', jsonBodyParser, addTagToRecipeHandler)
router.delete('/:recipeId/tags/:index', removeTagFromRecipeHandler)

export default router