import authenticatedFetch from './authenticatedFetch'
import { errors } from 'com'
import type { RecipeListItem } from '../types/recipe'

const getMyRecipes = (): Promise<RecipeListItem[]> => {
    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/my-recipes`, {
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
                    .then((myRecipes: RecipeListItem[]) => myRecipes)

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default getMyRecipes
