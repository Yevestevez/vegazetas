import { errors, validate } from 'com'

const { NotFoundError, SystemError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindMyRecipes = (userId: string) => Promise<any[]>
export type FindPublishedRecipes = (userId: string) => Promise<any[]>
export type FindFavoritesRecipes = (userId: string, favoriteIds: string[]) => Promise<any[]>

export interface RecipeListItem {
    id: string
    title: string
    images?: string[]
    own: boolean
    isFavorite: boolean
    published: boolean
    author: { id: string; username: string }
    [key: string]: any
}

export type GetRecipeList = (userId: unknown) => Promise<RecipeListItem[]>
export type GetFavoritesRecipeList = (userId: unknown) => Promise<RecipeListItem[]>

function normalizeRecipeList(recipes: any[], userId: string, favorites: string[]): RecipeListItem[] {
    return recipes.map(recipe => {
        const id = recipe._id.toString()
        delete recipe._id

        if (recipe.author && recipe.author._id) {
            recipe.author.id = recipe.author._id.toString()
            delete recipe.author._id
        }

        recipe.id = id
        recipe.own = userId === (recipe.author?.id || '')
        recipe.isFavorite = favorites.includes(id)

        return recipe as RecipeListItem
    })
}

export function createGetMyRecipes(
    findUserById: FindUserById,
    findMyRecipes: FindMyRecipes
): GetRecipeList {
    return (userId) => {
        validate.id(userId, 'userId')

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                const favorites = (user.favorites || []).map((f: any) => f.toString())

                return findMyRecipes(userId as string)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipes => normalizeRecipeList(recipes, userId as string, favorites))
            })
    }
}

export function createGetPublishedRecipes(
    findUserById: FindUserById,
    findPublishedRecipes: FindPublishedRecipes
): GetRecipeList {
    return (userId) => {
        validate.id(userId, 'userId')

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                const favorites = (user.favorites || []).map((f: any) => f.toString())

                return findPublishedRecipes(userId as string)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipes => normalizeRecipeList(recipes, userId as string, favorites))
            })
    }
}

export function createGetFavoritesRecipes(
    findUserById: FindUserById,
    findFavoritesRecipes: FindFavoritesRecipes
): GetFavoritesRecipeList {
    return (userId) => {
        validate.id(userId, 'userId')

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                const favorites = (user.favorites || []).map((f: any) => f.toString())

                return findFavoritesRecipes(userId as string, favorites)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipes => normalizeRecipeList(recipes, userId as string, favorites))
            })
    }
}
