import { errors, validate } from 'com'
import type { UserFavorites } from 'com/types/repo-types.ts'

const { NotFoundError, SystemError, OwnershipError } = errors

export type FindUserById = (userId: string) => Promise<UserFavorites | null>
export type FindRecipeById = (recipeId: string) => Promise<any | null>

export interface RecipeResponse {
    id: string
    title: string
    description: string
    ingredients: any[]
    steps: any[]
    images?: any[]
    tags?: string[]
    own: boolean
    isFavorite: boolean
    published: boolean
    author: { _id: string; username: string }
    [key: string]: any
}

export type GetRecipeById = (userId: unknown, recipeId: unknown) => Promise<RecipeResponse>

export function createGetRecipeById(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById
): GetRecipeById {
    return (userId, recipeId) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                const favorites = (user.favorites || []).map(f => f.toString())

                return findRecipeById(recipeId as string)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipe => {
                        if (!recipe) throw new NotFoundError('recipe not found')

                        const authorId = recipe.author._id.toString()
                        const isOwn = authorId === userId

                        if (!isOwn && !recipe.published) {
                            throw new OwnershipError('recipe not published')
                        }

                        return normalizeRecipe(recipe, isOwn, favorites)
                    })
            })
    }
}

function normalizeRecipe(recipe: any, isOwn: boolean, favorites: string[]): RecipeResponse {
    const id = recipe._id.toString()
    delete recipe._id

    recipe.id = id
    recipe.own = isOwn
    recipe.isFavorite = favorites.includes(id)

    if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach((ing: any) => {
            ing.id = ing._id.toString()
            delete ing._id
            delete ing.__v
        })
    }

    if (Array.isArray(recipe.steps)) {
        recipe.steps.forEach((step: any) => {
            step.id = step._id.toString()
            delete step._id
            delete step.__v
        })
    }

    return recipe as RecipeResponse
}
