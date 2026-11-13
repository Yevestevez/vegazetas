import { errors, validate } from 'com'

const { NotFoundError, SystemError } = errors

type FavoriteValue = string | { toString: () => string }

export type FavoriteUser = {
    favorites?: FavoriteValue[] | null
    save: () => Promise<FavoriteUser>
    toJSON: () => Record<string, unknown> & { password?: unknown }
}

type FindUserById = (userId: string) => Promise<FavoriteUser | null>
type RecipeExists = (recipeId: string) => Promise<boolean>

function validateId(value: unknown, field: string): asserts value is string {
    validate.id(value, field)
}

const errorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error)

export const createToggleFavoriteRecipe = (findUserById: FindUserById, recipeExists: RecipeExists) =>
    (userId: unknown, recipeId: unknown): Promise<FavoriteUser> => {
        validateId(userId, 'userId')
        validateId(recipeId, 'recipeId')

        return Promise.all([findUserById(userId), recipeExists(recipeId)])
            .then(([user, exists]) => {
                if (!user) throw new NotFoundError('User not found')
                if (!exists) throw new NotFoundError('Recipe not found')

                if (!Array.isArray(user.favorites)) user.favorites = []

                const favoritesAsStrings = user.favorites.map(favorite => favorite.toString())

                if (favoritesAsStrings.includes(recipeId)) {
                    user.favorites = user.favorites.filter(favorite => favorite.toString() !== recipeId)
                } else {
                    user.favorites.push(recipeId)
                }

                return user.save()
            })
            .catch(error => {
                if (error instanceof NotFoundError) throw error

                throw new SystemError(errorMessage(error))
            })
    }
