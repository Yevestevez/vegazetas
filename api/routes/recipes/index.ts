import express from 'express'

import getRecipeByIdHandler from '../../modules/recipes/getRecipeById/composition.ts'
import { getMyRecipesHandler, getPublishedRecipesHandler, getFavoritesRecipesHandler } from '../../modules/recipes/recipeList/composition.ts'
import createRecipeHandler from '../../modules/recipes/createRecipe/composition.ts'
import { updateRecipeHandler, deleteRecipeHandler } from '../../modules/recipes/recipeEdit/composition.ts'
import togglePublishRecipeHandler from '../../modules/recipes/togglePublishRecipe/composition.ts'
import { addIngredientToRecipeHandler, removeIngredientFromRecipeHandler } from '../../modules/recipes/recipeIngredients/composition.ts'
import { addStepToRecipeHandler, removeStepFromRecipeHandler, updateStepHandler, reorderStepHandler } from '../../modules/recipes/recipeSteps/composition.ts'
import { addImageToRecipeHandler, removeImageFromRecipeHandler } from '../../modules/recipes/recipeImages/composition.ts'
import { addTagToRecipeHandler, removeTagFromRecipeHandler } from '../../modules/recipes/recipeTags/composition.ts'

import jsonBodyParser from '../../middlewares/jsonBodyParser.ts'

const router = express.Router()

router.post('/', jsonBodyParser, createRecipeHandler)
router.delete('/:recipeId', deleteRecipeHandler)
router.patch('/:recipeId', jsonBodyParser, updateRecipeHandler)

router.get('/my-recipes', getMyRecipesHandler)
router.get('/published-recipes', getPublishedRecipesHandler)
router.get('/favorites-recipes', getFavoritesRecipesHandler)
router.get('/:recipeId', getRecipeByIdHandler)
router.patch('/:recipeId/publish', togglePublishRecipeHandler)

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
