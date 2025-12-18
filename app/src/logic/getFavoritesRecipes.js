import { errors } from 'com'

const getFavoritesRecipes = () => {
    return fetch(`${import.meta.env.VITE_API_URL}/recipes/favorites-recipes`, {
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
                    .then(publishedRecipes => publishedRecipes)

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default getFavoritesRecipes