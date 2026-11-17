import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createAddStepToRecipe, createRemoveStepFromRecipe, createUpdateStepInRecipe, createReorderStepInRecipe } from './recipeSteps.ts'
import { createAddStepHandler, createRemoveStepHandler, createUpdateStepHandler, createReorderStepHandler } from './recipeStepsHandler.ts'

const addStepToRecipe = createAddStepToRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.addStepToRecipe)
const removeStepFromRecipe = createRemoveStepFromRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.removeStepFromRecipe)
const updateStepInRecipe = createUpdateStepInRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.updateStepInRecipe)
const reorderStepInRecipe = createReorderStepInRecipe(userRepo.findUserById, recipeRepo.findRecipeById, recipeRepo.reorderStepInRecipe)

const addStepToRecipeHandler = createAddStepHandler(addStepToRecipe)
const removeStepFromRecipeHandler = createRemoveStepHandler(removeStepFromRecipe)
const updateStepHandler = createUpdateStepHandler(updateStepInRecipe)
const reorderStepHandler = createReorderStepHandler(reorderStepInRecipe)

export { addStepToRecipeHandler, removeStepFromRecipeHandler, updateStepHandler, reorderStepHandler }
