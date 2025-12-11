import registerUser from "./registerUser"
import loginUser from "./loginUser"
import getUserName from "./getUserName"
import isUserLoggedIn from "./isUserLoggedIn"
import logoutUser from "./logoutUser"
import getUserId from "./getUserId"
import getUserUsername from "./getUserUsername"
import passwordRecover from "./passwordRecover"
import passwordReset from "./passwordReset"
import toggleFavoriteRecipe from "./toggleFavoriteRecipe"

import getMyRecipes from "./getMyRecipes"
import getPublishedRecipes from "./getPublishedRecipes"
import getRecipeById from "./getRecipeById"
import createRecipe from "./createRecipe"
import updateRecipe from "./updateRecipe"
import deleteRecipe from "./deleteRecipe"
import togglePublishRecipe from "./togglePublishRecipe"

import addIngredientToRecipe from "./addIngredientToRecipe"
import removeIngredientFromRecipe from "./removeIngredientFromRecipe"

import addStepToRecipe from "./addStepToRecipe"
import removeStepFromRecipe from "./removeStepFromRecipe"
import reorderStep from "./reorderStep.js"
import updateStep from "./updateStep.js"

import addImageToRecipe from "./addImageToRecipe"
import removeImageFromRecipe from "./removeImageFromRecipe"

import addTagToRecipe from "./addTagToRecipe"
import removeTagFromRecipe from "./removeTagFromRecipe"

const logic = {
    registerUser,
    loginUser,
    getUserName,
    isUserLoggedIn,
    logoutUser,
    getUserId,
    getUserUsername,
    passwordRecover,
    passwordReset,
    toggleFavoriteRecipe,

    getMyRecipes,
    getPublishedRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
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