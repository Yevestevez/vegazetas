import authenticatedFetch from './authenticatedFetch'
import { validate, errors } from 'com'

const toggleFavoriteRecipe = (recipeId: string): Promise<{ isFavorite: boolean }> => {
    validate.id(recipeId, 'recipeId')

    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/users/favorites/${recipeId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        }
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status >= 200 && status < 300) {
                return res.json()
            }

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors] || Error

                    throw new constructor(message)
                })
        })
}

export default toggleFavoriteRecipe
