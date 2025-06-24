import { validate, errors } from 'com'

const reorderStep = (
    recipeId,
    stepId,
    direction,
) => {
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')
    validate.direction(direction)

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/steps/${stepId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            direction
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

export default reorderStep