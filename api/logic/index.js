import registerUser from './registerUser.js'
import authenticateUser from './authenticateUser.js'
import getUserName from './getUserName.js'
import getUserUsername from './getUserUsername.js'
import passwordRecover from './passwordRecover.js'
import passwordReset from './passwordReset.js'

import createRecipe from './createRecipe.js'
import getMyRecipes from './getMyRecipes.js'
import deleteRecipe from './deleteRecipe.js'
import updateRecipe from './updateRecipe.js'
import getRecipeById from './getRecipeById.js'

import addIngredientToRecipe from './addIngredientToRecipe.js'
import removeIngredientFromRecipe from './removeIngredientFromRecipe.js'

import addStepToRecipe from './addStepToRecipe.js'
import removeStepFromRecipe from './removeStepFromRecipe.js'
import reorderStep from './reorderStep.js'

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

    createRecipe,
    getMyRecipes,
    deleteRecipe,
    updateRecipe,
    getRecipeById,

    addIngredientToRecipe,
    removeIngredientFromRecipe,

    addStepToRecipe,
    removeStepFromRecipe,
    reorderStep,

    addImageToRecipe,
    removeImageFromRecipe,

    addTagToRecipe,
    removeTagFromRecipe
}

export default logic