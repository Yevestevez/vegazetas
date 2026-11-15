import authenticatedFetch from './authenticatedFetch'
import { errors } from 'com'

interface Recipe {
    id: string
    title: string
    published: boolean
    isFavorite: boolean
    images: string[]
    author: { username: string }
    date: string
    own?: boolean
    [key: string]: any
}

const getFavoritesRecipes = (): Promise<Recipe[]> => {
    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/favorites-recipes`, {
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
                    .then((publishedRecipes: Recipe[]) => publishedRecipes)

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default getFavoritesRecipes
