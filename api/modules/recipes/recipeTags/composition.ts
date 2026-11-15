import { findUserById, findRecipeById, createAddTag, createRemoveTag } from './recipeTagsRepository.ts'
import { createAddTagToRecipe, createRemoveTagFromRecipe } from './recipeTags.ts'
import { createAddTagHandler, createRemoveTagHandler } from './recipeTagsHandler.ts'

const addTagToRecipe = createAddTagToRecipe(findUserById, findRecipeById, createAddTag)
const removeTagFromRecipe = createRemoveTagFromRecipe(findUserById, findRecipeById, createRemoveTag)

const addTagToRecipeHandler = createAddTagHandler(addTagToRecipe)
const removeTagFromRecipeHandler = createRemoveTagHandler(removeTagFromRecipe)

export { addTagToRecipeHandler, removeTagFromRecipeHandler }
