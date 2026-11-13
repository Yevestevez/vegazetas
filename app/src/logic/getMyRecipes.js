import authenticatedFetch from './authenticatedFetch'
import { errors } from 'com'

const getMyRecipes = () => {
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
                    .then(myRecipes => myRecipes)

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default getMyRecipes
