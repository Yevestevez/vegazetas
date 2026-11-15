import { findUserById, findAndToggleRecipe } from './togglePublishRecipeRepository.ts'
import { createTogglePublishRecipe } from './togglePublishRecipe.ts'
import { createTogglePublishHandler } from './togglePublishRecipeHandler.ts'

const togglePublishRecipe = createTogglePublishRecipe(findUserById, findAndToggleRecipe)
const togglePublishHandler = createTogglePublishHandler(togglePublishRecipe)

export default togglePublishHandler
