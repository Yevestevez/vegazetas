import { validate, errors } from 'com'

const removeStepFromRecipe = (recipeId, stepId) => {
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/steps/${stepId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
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

export default removeStepFromRecipe