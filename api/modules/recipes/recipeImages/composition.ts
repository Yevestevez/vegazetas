import { findUserById, findRecipeById, createAddImage, createRemoveImage } from './recipeImagesRepository.ts'
import { createAddImageToRecipe, createRemoveImageFromRecipe } from './recipeImages.ts'
import { createAddImageHandler, createRemoveImageHandler } from './recipeImagesHandler.ts'

const addImageToRecipe = createAddImageToRecipe(findUserById, findRecipeById, createAddImage)
const removeImageFromRecipe = createRemoveImageFromRecipe(findUserById, findRecipeById, createRemoveImage)

const addImageToRecipeHandler = createAddImageHandler(addImageToRecipe)
const removeImageFromRecipeHandler = createRemoveImageHandler(removeImageFromRecipe)

export { addImageToRecipeHandler, removeImageFromRecipeHandler }
