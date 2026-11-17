import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createGetRecipeById } from './getRecipeById.ts'
import { createGetRecipeByIdHandler } from './getRecipeByIdHandler.ts'

const getRecipeById = createGetRecipeById(userRepo.findUserByIdWithFavorites, recipeRepo.findRecipeByIdWithViews)
const getRecipeByIdHandler = createGetRecipeByIdHandler(getRecipeById)

export default getRecipeByIdHandler
