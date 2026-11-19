import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createAddTagToRecipe, createRemoveTagFromRecipe } from './recipeTags.ts'
import { createAddTagHandler, createRemoveTagHandler } from './recipeTagsHandler.ts'

const addTagToRecipe = createAddTagToRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.addTagToRecipe)
const removeTagFromRecipe = createRemoveTagFromRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.removeTagFromRecipe)

const addTagToRecipeHandler = createAddTagHandler(addTagToRecipe)
const removeTagFromRecipeHandler = createRemoveTagHandler(removeTagFromRecipe)

export { addTagToRecipeHandler, removeTagFromRecipeHandler }
