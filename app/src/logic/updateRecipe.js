import { validate, errors } from 'com'

const updateRecipe = (
    recipeId,
    title,
    description,
    time,
    difficulty
) => {
    validate.id(recipeId, 'recipeId')
    validate.title(title)
    if (description) validate.description(description)
    if (time) validate.time(time)
    if (difficulty) validate.difficulty(difficulty)

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}`, {
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
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default updateRecipe