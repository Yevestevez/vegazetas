import { findUserById, findRecipeById, createAddImage, createRemoveImage } from './recipeImagesRepository.js'
import { createAddImageToRecipe, createRemoveImageFromRecipe } from './recipeImages.js'
import { createAddImageHandler, createRemoveImageHandler } from './recipeImagesHandler.js'

const addImageToRecipe = createAddImageToRecipe(findUserById, findRecipeById, createAddImage)
const removeImageFromRecipe = createRemoveImageFromRecipe(findUserById, findRecipeById, createRemoveImage)

const addImageToRecipeHandler = createAddImageHandler(addImageToRecipe)
const removeImageFromRecipeHandler = createRemoveImageHandler(removeImageFromRecipe)

export { addImageToRecipeHandler, removeImageFromRecipeHandler }
