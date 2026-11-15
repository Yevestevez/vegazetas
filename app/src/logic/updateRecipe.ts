import authenticatedFetch from './authenticatedFetch'
import { validate, errors } from 'com'

const updateRecipe = (
    recipeId: string,
    title: string,
    description: string | null | undefined,
    time: number | undefined,
    difficulty: string | undefined
): Promise<void> => {
    validate.id(recipeId, 'recipeId')
    validate.title(title)
    if (description) validate.description(description)
    if (time !== undefined) validate.time(time)
    if (difficulty) validate.difficulty(difficulty)

    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            description,
            time,
            difficulty
        })
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

export default updateRecipe
