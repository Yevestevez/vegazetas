import { findUserById, saveRecipe } from './recipeRepository.ts'
import { createCreateRecipe } from './createRecipe.ts'
import { createCreateRecipeHandler } from './createRecipeHandler.ts'

const createRecipe = createCreateRecipe(findUserById, saveRecipe)
const createRecipeHandler = createCreateRecipeHandler(createRecipe)

export default createRecipeHandler
