import authenticatedFetch from './authenticatedFetch'
import { validate, errors } from 'com'

const reorderStep = (
    recipeId: string,
    stepId: string,
    direction: string
): Promise<void> => {
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')
    validate.direction(direction)

    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/steps/${stepId}/reorder`, {
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
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default reorderStep
