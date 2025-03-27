import registerUser from "./registerUser"
import loginUser from "./loginUser"
import getUserName from "./getUserName"
import isUserLoggedIn from "./isUserLoggedIn"
import logoutUser from "./logoutUser"
import getUserId from "./getUserId"
import getUserUsername from "./getUserUsername"

import getMyRecipes from "./getMyRecipes"
import getRecipeById from "./getRecipeById"
import createRecipe from "./createRecipe"
import updateRecipe from "./updateRecipe"
import deleteRecipe from "./deleteRecipe"

import addIngredientToRecipe from "./addIngredientToRecipe"
import removeIngredientFromRecipe from "./removeIngredientFromRecipe"

import addStepToRecipe from "./addStepToRecipe"
import removeStepFromRecipe from "./removeStepFromRecipe"

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

    getMyRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,

    addIngredientToRecipe,
    removeIngredientFromRecipe,

    addStepToRecipe,
    removeStepFromRecipe,

    addImageToRecipe,
    removeImageFromRecipe,

    addTagToRecipe,
    removeTagFromRecipe
}

export default logic