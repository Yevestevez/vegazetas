import registerUser from './registerUser.js'
import authenticateUser from './authenticateUser.js'
import getUserName from './getUserName.js'

import createRecipe from './createRecipe.js'
import getMyRecipes from './getMyRecipes.js'
import deleteRecipe from './deleteRecipe.js'
import updateRecipe from './updateRecipe.js'

import addIngredientToRecipe from './addIngredientToRecipe.js'
import removeIngredientFromRecipe from './removeIngredientFromRecipe.js'

import addStepToRecipe from './addStepToRecipe.js'

const logic = {
    registerUser,
    authenticateUser,
    getUserName,

    createRecipe,
    getMyRecipes,
    deleteRecipe,
    updateRecipe,
    addIngredientToRecipe,
    removeIngredientFromRecipe,
    addStepToRecipe
}

export default logic