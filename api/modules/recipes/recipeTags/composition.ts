import { findUserById, findRecipeById, createAddTag, createRemoveTag } from './recipeTagsRepository.js'
import { createAddTagToRecipe, createRemoveTagFromRecipe } from './recipeTags.js'
import { createAddTagHandler, createRemoveTagHandler } from './recipeTagsHandler.js'

const addTagToRecipe = createAddTagToRecipe(findUserById, findRecipeById, createAddTag)
const removeTagFromRecipe = createRemoveTagFromRecipe(findUserById, findRecipeById, createRemoveTag)

const addTagToRecipeHandler = createAddTagHandler(addTagToRecipe)
const removeTagFromRecipeHandler = createRemoveTagHandler(removeTagFromRecipe)

export { addTagToRecipeHandler, removeTagFromRecipeHandler }
