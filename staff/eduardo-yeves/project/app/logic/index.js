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

import addStepToRecipe from "./addStepToRecipe"

import addImageToRecipe from "./addImageToRecipe"

import addTagToRecipe from "./addTagToRecipe"

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

    addStepToRecipe,

    addImageToRecipe,

    addTagToRecipe
}

export default logic