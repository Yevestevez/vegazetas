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
    createRecipe
}

export default logic