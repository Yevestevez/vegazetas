import { User, Recipe } from '../../../data/models.ts'
import type { FindUserById, FindRecipeById } from './getRecipeById.ts'
import type { UserFavorites } from 'com/types/repo-types.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId, 'favorites').lean().exec() as Promise<UserFavorites | null>

export const findRecipeById: FindRecipeById = recipeId =>
    Recipe.findOneAndUpdate(
        { _id: recipeId },
        { $inc: { views: 1 } },
        { new: true, select: '-__v' }
    )
        .populate('author', 'username')
        .exec()
