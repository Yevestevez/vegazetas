import { validate, errors } from 'com'

const passwordReset = (token, newPassword) => {
    validate.password(newPassword)

    return fetch(`${import.meta.env.VITE_API_URL}/users/password/reset/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
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

export default passwordReset