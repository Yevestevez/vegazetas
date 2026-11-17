import authenticatedFetch from '../authenticatedFetch'
import { errors } from 'com'
import type { RecipeData } from '../../types/recipe'

const getRecipeById = (recipeId: string): Promise<RecipeData> => {
    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}`, {
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
                    .then((recipe: RecipeData) => recipe)

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default getRecipeById
