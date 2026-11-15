import { Recipe, User } from '../../../data/models.js'
import type { FindUserById, FindRecipeById, AddTag, RemoveTag } from './recipeTags.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).exec()

export const findRecipeById: FindRecipeById = recipeId =>
    Recipe.findById(recipeId).exec()

export function createAddTag(userId: string, recipeId: string): AddTag {
    const recipe = findRecipeById(recipeId)
    return (tag) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                if (doc.tags.length >= 15) throw new Error('too many tags')
                doc.tags.push(tag)
                return doc.save()
            })
            .then(() => {})
    }
}

export function createRemoveTag(userId: string, recipeId: string): RemoveTag {
    const recipe = findRecipeById(recipeId)
    return (index) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                if (index >= doc.tags.length) throw new Error('tag not found')
                doc.tags.splice(index, 1)
                return doc.save()
            })
            .then(() => {})
    }
}
