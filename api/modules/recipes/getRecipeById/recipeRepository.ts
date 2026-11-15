import { User, Recipe } from '../../../data/models.js'
import type { FindUserById, FindRecipeById } from './getRecipeById.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).select('favorites').lean().exec()

export const findRecipeById: FindRecipeById = recipeId =>
    Recipe.findById(recipeId).select('-__v').populate('author', 'username').lean().exec()
