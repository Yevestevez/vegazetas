import { validate, errors } from 'com'

const addStepToRecipe = (
    recipeId,
    text,
    note,
    image
) => {
    validate.id(recipeId, 'recipeId')
    validate.text(text)
    if (note) validate.note(note)
    if (image) validate.image(image)

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

            if (status === 201)
                return res.json()
                    .then(stepId => stepId)

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default addStepToRecipe