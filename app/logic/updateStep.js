import { validate, errors } from 'com'

const { ValidationError } = errors

const updateStep = (
    recipeId,
    stepId,
    text,
    note,
    image
) => {
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')
    validate.text(text)

    const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
    if (image !== undefined) {
        if (typeof image !== 'string') throw new ValidationError('invalid image type, must be a string')
        if (image !== '' && !URL_REGEX.test(image)) throw new ValidationError('invalid image syntax, must be a valid URL')
    }

    if (note !== undefined) {
        if (typeof note !== 'string') throw new ValidationError('invalid note type, must be a string')
        if (note.length > 500) throw new ValidationError('invalid note length, must be 500 characters maximum')
    }

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/steps/${stepId}`, {
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
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default updateStep