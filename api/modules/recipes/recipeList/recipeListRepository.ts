import { User, Recipe } from '../../../data/models.js'
import type { FindUserById, FindMyRecipes, FindPublishedRecipes, FindFavoritesRecipes } from './recipeList.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).select('favorites').lean().exec()

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
