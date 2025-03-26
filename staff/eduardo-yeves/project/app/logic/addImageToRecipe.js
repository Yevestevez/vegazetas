import { validate, errors } from 'com'

const addImageToRecipe = (recipeId, image) => {
    validate.id(recipeId, 'recipeId')
    validate.image(image)

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/images`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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

export default addImageToRecipe