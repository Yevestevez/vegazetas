import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createGetMyRecipes, createGetPublishedRecipes, createGetFavoritesRecipes } from './recipeList.ts'
import { createRecipeListHandler } from './recipeListHandler.ts'

const getMyRecipes = createGetMyRecipes(userRepo.findUserByIdWithFavorites, recipeRepo.findMyRecipes)
const getPublishedRecipes = createGetPublishedRecipes(userRepo.findUserByIdWithFavorites, recipeRepo.findPublishedRecipes)
const getFavoritesRecipes = createGetFavoritesRecipes(userRepo.findUserByIdWithFavorites, recipeRepo.findFavoritesRecipes)

const getMyRecipesHandler = createRecipeListHandler(getMyRecipes)
const getPublishedRecipesHandler = createRecipeListHandler(getPublishedRecipes)
const getFavoritesRecipesHandler = createRecipeListHandler(getFavoritesRecipes)

export { getMyRecipesHandler, getPublishedRecipesHandler, getFavoritesRecipesHandler }
