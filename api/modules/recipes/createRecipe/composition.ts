import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createCreateRecipe } from './createRecipe.ts'
import { createCreateRecipeHandler } from './createRecipeHandler.ts'

const createRecipe = createCreateRecipe(userRepo.findUserByIdLean, recipeRepo.saveRecipe)
const createRecipeHandler = createCreateRecipeHandler(createRecipe)

export default createRecipeHandler
