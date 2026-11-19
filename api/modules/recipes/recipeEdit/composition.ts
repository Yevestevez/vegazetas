import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createUpdateRecipe, createDeleteRecipe } from './recipeEdit.ts'
import { createUpdateRecipeHandler, createDeleteRecipeHandler } from './recipeEditHandler.ts'

const updateRecipe = createUpdateRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.updateRecipeDoc)
const deleteRecipe = createDeleteRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.deleteRecipeDoc, recipeRepo.cleanUserFavorites, recipeRepo.cleanRecipeLikedBy)

const updateRecipeHandler = createUpdateRecipeHandler(updateRecipe)
const deleteRecipeHandler = createDeleteRecipeHandler(deleteRecipe)

export { updateRecipeHandler, deleteRecipeHandler }
