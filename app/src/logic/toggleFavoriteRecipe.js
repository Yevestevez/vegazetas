import { validate, errors } from 'com'

const toggleFavoriteRecipe = (
    recipeId
) => {
    validate.id(recipeId, 'recipeId')

    return fetch(`${import.meta.env.VITE_API_URL}/users/favorites/${recipeId}`, {
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
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error] || Error

                    throw new constructor(message)
                })
        })
}

export default toggleFavoriteRecipe