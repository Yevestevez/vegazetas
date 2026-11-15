import authenticatedFetch from './authenticatedFetch'
import { errors } from 'com'

interface Recipe {
    id: string
    [key: string]: any
}

const getRecipeById = (recipeId: string): Promise<Recipe> => {
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
                    .then((recipe: Recipe) => recipe)

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default getRecipeById
