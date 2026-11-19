import { loginUser, logoutUser, registerUser, passwordRecover, passwordReset, getUserName, getUserUsername, getUserId, isUserLoggedIn, toggleFavoriteRecipe } from './auth'
import { createRecipe, getRecipeById, updateRecipe, deleteRecipe, getMyRecipes, getPublishedRecipes, getFavoritesRecipes, togglePublishRecipe } from './recipes'
import { addIngredientToRecipe, removeIngredientFromRecipe } from './recipes/ingredients'
import { addStepToRecipe, removeStepFromRecipe, reorderStep, updateStep } from './recipes/steps'
import { addImageToRecipe, removeImageFromRecipe } from './recipes/images'
import { addTagToRecipe, removeTagFromRecipe } from './recipes/tags'

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
    getFavoritesRecipes,
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
