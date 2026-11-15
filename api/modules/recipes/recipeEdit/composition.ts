import { findUserById, findRecipeById, updateRecipeDoc, deleteRecipeDoc } from './recipeEditRepository.ts'
import { createUpdateRecipe, createDeleteRecipe } from './recipeEdit.ts'
import { createUpdateRecipeHandler, createDeleteRecipeHandler } from './recipeEditHandler.ts'

const updateRecipe = createUpdateRecipe(findUserById, findRecipeById, updateRecipeDoc)
const deleteRecipe = createDeleteRecipe(findUserById, findRecipeById, deleteRecipeDoc)

const updateRecipeHandler = createUpdateRecipeHandler(updateRecipe)
const deleteRecipeHandler = createDeleteRecipeHandler(deleteRecipe)

export { updateRecipeHandler, deleteRecipeHandler }
