import { findUserById, findRecipeById, createAddIngredient, createRemoveIngredient } from './recipeIngredientsRepository.js'
import { createAddIngredientToRecipe, createRemoveIngredientFromRecipe } from './recipeIngredients.js'
import { createAddIngredientHandler, createRemoveIngredientHandler } from './recipeIngredientsHandler.js'

const addIngredientToRecipe = createAddIngredientToRecipe(findUserById, findRecipeById, createAddIngredient)
const removeIngredientFromRecipe = createRemoveIngredientFromRecipe(findUserById, findRecipeById, createRemoveIngredient)

const addIngredientToRecipeHandler = createAddIngredientHandler(addIngredientToRecipe)
const removeIngredientFromRecipeHandler = createRemoveIngredientHandler(removeIngredientFromRecipe)

export { addIngredientToRecipeHandler, removeIngredientFromRecipeHandler }
