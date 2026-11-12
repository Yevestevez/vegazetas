import logic from '../../../logic/index.js'
import { createRecipeListHandler } from './createRecipeListHandler.js'

export default createRecipeListHandler(logic.getPublishedRecipes)