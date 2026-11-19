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
    const ingredients = (Array.isArray(recipe.ingredients) 
        ? recipe.ingredients.map((ing: any) => ({ id: ing._id.toString(), name: ing.name, quantity: ing.quantity, unit: ing.unit, annotation: ing.annotation, main: ing.main }))
        : []
    )
    const steps = (Array.isArray(recipe.steps)
        ? recipe.steps.map((step: any) => ({ id: step._id.toString(), text: step.text, note: step.note, image: step.image, order: step.order }))
        : []
    )

    return {
        id,
        title: recipe.title,
        description: recipe.description,
        images: recipe.images || [],
        date: recipe.date,
        time: recipe.time,
        difficulty: recipe.difficulty,
        category: recipe.category,
        servings: recipe.servings,
        tags: recipe.tags || [],
        ingredients,
        steps,
        published: recipe.published,
        source: recipe.source,
        sourceUrl: recipe.sourceUrl,
        aiNotes: recipe.aiNotes,
        views: recipe.views,
        likedBy: recipe.likedBy || [],
        own: isOwn,
        isFavorite: favorites.includes(id),
        author: {
            _id: recipe.author._id.toString(),
            username: recipe.author.username
        }
    }
}
