import { validate, errors } from 'com'

const addStepToRecipe = (
    userId,
    recipeId,
    text,
    note,
    image
) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.text(text)
    validate.note(note)
    validate.image(image)

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/steps`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text,
            note,
            image
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

export default addStepToRecipe