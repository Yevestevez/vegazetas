import { validate, errors } from 'com'

const addTagToRecipe = (recipeId, tag) => {
    validate.id(recipeId, 'recipeId')
    validate.tag(tag)

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/tags`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tag
        })
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 201) return;

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error];

                    throw new constructor(message)
                })
        })
}

export default addTagToRecipe