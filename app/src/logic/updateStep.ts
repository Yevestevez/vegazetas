import authenticatedFetch from './authenticatedFetch'
import { validate, errors } from 'com'

const { ValidationError } = errors

const updateStep = (
    recipeId: string,
    stepId: string,
    text: string,
    note: string | undefined,
    image: string | undefined
): Promise<void> => {
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')
    validate.text(text)

    if (image !== undefined) validate.image(image)

    if (note !== undefined) validate.noteForUpdate(note)

    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/steps/${stepId}`, {
        method: 'PATCH',
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

            if (status === 204) return

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default updateStep
