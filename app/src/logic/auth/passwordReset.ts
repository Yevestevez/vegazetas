import { validate, errors } from 'com'

const passwordReset = (token: string, newPassword: string): Promise<void> => {
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
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default passwordReset
