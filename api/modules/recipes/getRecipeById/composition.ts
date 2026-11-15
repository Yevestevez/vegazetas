import { findUserById, findRecipeById } from './recipeRepository.ts'
import { createGetRecipeById } from './getRecipeById.ts'
import { createGetRecipeByIdHandler } from './getRecipeByIdHandler.ts'

const getRecipeById = createGetRecipeById(findUserById, findRecipeById)
const getRecipeByIdHandler = createGetRecipeByIdHandler(getRecipeById)

export default getRecipeByIdHandler
