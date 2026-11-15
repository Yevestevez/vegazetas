import { findUserById, findAndToggleRecipe } from './togglePublishRecipeRepository.js'
import { createTogglePublishRecipe } from './togglePublishRecipe.js'
import { createTogglePublishHandler } from './togglePublishRecipeHandler.js'

const togglePublishRecipe = createTogglePublishRecipe(findUserById, findAndToggleRecipe)
const togglePublishHandler = createTogglePublishHandler(togglePublishRecipe)

export default togglePublishHandler
