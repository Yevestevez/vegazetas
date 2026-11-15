import { findUserById, findRecipeById, createAddIngredient, createRemoveIngredient } from './recipeIngredientsRepository.ts'
import { createAddIngredientToRecipe, createRemoveIngredientFromRecipe } from './recipeIngredients.ts'
import { createAddIngredientHandler, createRemoveIngredientHandler } from './recipeIngredientsHandler.ts'

const addIngredientToRecipe = createAddIngredientToRecipe(findUserById, findRecipeById, createAddIngredient)
const removeIngredientFromRecipe = createRemoveIngredientFromRecipe(findUserById, findRecipeById, createRemoveIngredient)

const addIngredientToRecipeHandler = createAddIngredientHandler(addIngredientToRecipe)
const removeIngredientFromRecipeHandler = createRemoveIngredientHandler(removeIngredientFromRecipe)

export { addIngredientToRecipeHandler, removeIngredientFromRecipeHandler }
