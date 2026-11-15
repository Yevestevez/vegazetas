import { validate, errors } from 'com'

const passwordRecover = (email: string): Promise<void> => {
    validate.email(email)

    return fetch(`${import.meta.env.VITE_API_URL}/users/password/recover`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 200) return

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default passwordRecover
