import authenticatedFetch from '../authenticatedFetch'
import { errors } from 'com'
import type { RecipeListItemWithAuthor } from '../../types/recipe'

const getPublishedRecipes = (): Promise<RecipeListItemWithAuthor[]> => {
    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/published-recipes`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 200)
                return res.json()
                    .then((publishedRecipes: RecipeListItemWithAuthor[]) => publishedRecipes)

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default getPublishedRecipes
