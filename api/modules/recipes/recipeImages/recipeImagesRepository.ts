import { Recipe, User } from '../../../data/models.ts'
import type { FindUserById, FindRecipeById, AddImage, RemoveImage } from './recipeImages.ts'

export const findUserById: FindUserById = userId =>
    User.findById(userId).exec()

export const findRecipeById: FindRecipeById = recipeId =>
    Recipe.findById(recipeId).exec()

export function createAddImage(userId: string, recipeId: string): AddImage {
    const recipe = findRecipeById(recipeId)
    return (image) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                return doc
            })
            .then(doc => {
                if (!doc) return null
                if (doc.images.length >= 2) throw new Error('too many images')
                doc.images.push(image)
                return doc.save()
            })
            .then(() => {})
    }
}

export function createRemoveImage(userId: string, recipeId: string): RemoveImage {
    const recipe = findRecipeById(recipeId)
    return (index) => {
        return recipe
            .then(doc => {
                if (!doc) return null
                if (index >= doc.images.length) throw new Error('image not found')
                doc.images.splice(index, 1)
                return doc.save()
            })
            .then(() => {})
    }
}
