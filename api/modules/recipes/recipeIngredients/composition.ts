import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createAddIngredientToRecipe, createRemoveIngredientFromRecipe } from './recipeIngredients.ts'
import { createAddIngredientHandler, createRemoveIngredientHandler } from './recipeIngredientsHandler.ts'

const addIngredientToRecipe = createAddIngredientToRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.addIngredientToRecipe)
const removeIngredientFromRecipe = createRemoveIngredientFromRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.removeIngredientFromRecipe)

const addIngredientToRecipeHandler = createAddIngredientHandler(addIngredientToRecipe)
const removeIngredientFromRecipeHandler = createRemoveIngredientHandler(removeIngredientFromRecipe)

export { addIngredientToRecipeHandler, removeIngredientFromRecipeHandler }
