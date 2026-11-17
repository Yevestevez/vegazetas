import { User, Recipe } from '../../../data/models.ts'
import type { FindUserById, FindRecipeById, UpdateRecipeDoc, DeleteRecipeDoc, CleanUserFavorites, CleanRecipeLikedBy } from './recipeEdit.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).lean().exec()

export const findRecipeById: FindRecipeById = recipeId =>
    Recipe.findById(recipeId).exec()

export const updateRecipeDoc: UpdateRecipeDoc = (recipeId, update) =>
    Recipe.findByIdAndUpdate(recipeId, update, { new: false }).exec()

export const deleteRecipeDoc: DeleteRecipeDoc = recipeId =>
    Recipe.findByIdAndDelete(recipeId).exec()

export const cleanUserFavorites: CleanUserFavorites = recipeId =>
    User.updateMany({}, { $pull: { favorites: recipeId } }).exec()

export const cleanRecipeLikedBy: CleanRecipeLikedBy = recipeId =>
    Recipe.updateMany({}, { $pull: { likedBy: recipeId } }).exec()
