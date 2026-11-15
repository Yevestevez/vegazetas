import { findUserById, findRecipeById, createAddStep, createRemoveStep, createUpdateStep, createReorderStep } from './recipeStepsRepository.js'
import { createAddStepToRecipe, createRemoveStepFromRecipe, createUpdateStepInRecipe, createReorderStepInRecipe } from './recipeSteps.js'
import { createAddStepHandler, createRemoveStepHandler, createUpdateStepHandler, createReorderStepHandler } from './recipeStepsHandler.js'

const addStepToRecipe = createAddStepToRecipe(findUserById, findRecipeById, createAddStep)
const removeStepFromRecipe = createRemoveStepFromRecipe(findUserById, findRecipeById, createRemoveStep)
const updateStepInRecipe = createUpdateStepInRecipe(findUserById, findRecipeById, createUpdateStep)
const reorderStepInRecipe = createReorderStepInRecipe(findUserById, findRecipeById, createReorderStep)

const addStepToRecipeHandler = createAddStepHandler(addStepToRecipe)
const removeStepFromRecipeHandler = createRemoveStepHandler(removeStepFromRecipe)
const updateStepHandler = createUpdateStepHandler(updateStepInRecipe)
const reorderStepHandler = createReorderStepHandler(reorderStepInRecipe)

export { addStepToRecipeHandler, removeStepFromRecipeHandler, updateStepHandler, reorderStepHandler }
