import { User, Recipe } from '../../../data/models.js'
import type { FindUserById, SaveRecipe } from './createRecipe.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).lean().exec()

export const saveRecipe: SaveRecipe = (data) =>
    new Recipe(data).save().then(recipe => recipe._id.toString())
