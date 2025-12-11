import registerUser from './registerUser.js'
import authenticateUser from './authenticateUser.js'
import getUserName from './getUserName.js'
import getUserUsername from './getUserUsername.js'
import passwordRecover from './passwordRecover.js'
import passwordReset from './passwordReset.js'
import toggleFavoriteRecipe from './toggleFavoriteRecipe.js'

import createRecipe from './createRecipe.js'
import getMyRecipes from './getMyRecipes.js'
import getPublishedRecipes from './getPublishedRecipes.js'
import deleteRecipe from './deleteRecipe.js'
import updateRecipe from './updateRecipe.js'
import getRecipeById from './getRecipeById.js'
import togglePublishRecipe from './togglePublishRecipe.js'

import addIngredientToRecipe from './addIngredientToRecipe.js'
import removeIngredientFromRecipe from './removeIngredientFromRecipe.js'

import addStepToRecipe from './addStepToRecipe.js'
import removeStepFromRecipe from './removeStepFromRecipe.js'
import reorderStep from './reorderStep.js'
import updateStep from './updateStep.js'

import addImageToRecipe from './addImageToRecipe.js'
import removeImageFromRecipe from './removeImageFromRecipe.js'

import addTagToRecipe from './addTagToRecipe.js'
import removeTagFromRecipe from './removeTagFromRecipe.js'

const logic = {
    registerUser,
    authenticateUser,
    getUserName,
    getUserUsername,
    passwordRecover,
    passwordReset,
    toggleFavoriteRecipe,

    createRecipe,
    getMyRecipes,
    getPublishedRecipes,
    deleteRecipe,
    updateRecipe,
    getRecipeById,
    togglePublishRecipe,

    addIngredientToRecipe,
    removeIngredientFromRecipe,

    addStepToRecipe,
    removeStepFromRecipe,
    reorderStep,
    updateStep,

    addImageToRecipe,
    removeImageFromRecipe,

    addTagToRecipe,
    removeTagFromRecipe
}

export default logic