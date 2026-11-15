import authenticatedFetch from './authenticatedFetch'
import { validate, errors } from 'com'

const removeTagFromRecipe = (recipeId: string, index: number): Promise<void> => {
    validate.id(recipeId, 'recipeId')
    // validate.index(index, 'index') número >= 0

    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/tags/${index}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 204) return

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default removeTagFromRecipe
