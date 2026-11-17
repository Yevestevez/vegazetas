import { userRepo, recipeRepo } from '../../../data/repositories/index.ts'
import { createTogglePublishRecipe } from './togglePublishRecipe.ts'
import { createTogglePublishHandler } from './togglePublishRecipeHandler.ts'

const togglePublishRecipe = createTogglePublishRecipe(userRepo.findUserById, recipeRepo.findAndToggleRecipe)
const togglePublishHandler = createTogglePublishHandler(togglePublishRecipe)

export default togglePublishHandler
