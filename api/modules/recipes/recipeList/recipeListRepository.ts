import { User, Recipe } from '../../../data/models.ts'
import type { FindUserById, FindMyRecipes, FindPublishedRecipes, FindFavoritesRecipes } from './recipeList.ts'
import type { UserFavorites } from 'com/types/repo-types.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId, 'favorites').lean().exec() as Promise<UserFavorites | null>

export const findMyRecipes: FindMyRecipes = userId =>
    Recipe.find({ author: userId })
        .select('_id title images author date published')
        .select('-__v')
        .populate('author', 'username')
        .lean()
        .sort('-date')
        .exec()

export const findPublishedRecipes: FindPublishedRecipes = userId =>
    Recipe.find({
        author: { $ne: userId },
        published: true
    })
        .select('_id title images author date published')
        .select('-__v')
        .populate('author', 'username')
        .lean()
        .sort('-date')
        .exec()

export const findFavoritesRecipes: FindFavoritesRecipes = (userId, favoriteIds) =>
    Recipe.find({
        _id: { $in: favoriteIds },
        $or: [
            { published: true },
            { author: userId }
        ]
    })
        .select('_id title images author date published')
        .select('-__v')
        .populate('author', 'username')
        .lean()
        .sort('-date')
        .exec()
