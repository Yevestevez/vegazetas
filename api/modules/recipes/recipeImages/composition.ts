import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createAddImageToRecipe, createRemoveImageFromRecipe } from './recipeImages.ts'
import { createAddImageHandler, createRemoveImageHandler } from './recipeImagesHandler.ts'

const addImageToRecipe = createAddImageToRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.addImageToRecipe)
const removeImageFromRecipe = createRemoveImageFromRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.removeImageFromRecipe)

const addImageToRecipeHandler = createAddImageHandler(addImageToRecipe)
const removeImageFromRecipeHandler = createRemoveImageHandler(removeImageFromRecipe)

export { addImageToRecipeHandler, removeImageFromRecipeHandler }
