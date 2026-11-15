import { findUserById, findMyRecipes, findPublishedRecipes, findFavoritesRecipes } from './recipeListRepository.ts'
import { createGetMyRecipes, createGetPublishedRecipes, createGetFavoritesRecipes } from './recipeList.ts'
import { createRecipeListHandler } from './recipeListHandler.ts'

const getMyRecipes = createGetMyRecipes(findUserById, findMyRecipes)
const getPublishedRecipes = createGetPublishedRecipes(findUserById, findPublishedRecipes)
const getFavoritesRecipes = createGetFavoritesRecipes(findUserById, findFavoritesRecipes)

const getMyRecipesHandler = createRecipeListHandler(getMyRecipes)
const getPublishedRecipesHandler = createRecipeListHandler(getPublishedRecipes)
const getFavoritesRecipesHandler = createRecipeListHandler(getFavoritesRecipes)

export { getMyRecipesHandler, getPublishedRecipesHandler, getFavoritesRecipesHandler }
