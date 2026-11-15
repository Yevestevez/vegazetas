import { validate, errors as comErrors } from 'com'
import { advanceSessionGeneration } from './authenticatedFetch'

const loginUser = (email: string, password: string): Promise<void> => {
    validate.email(email)
    validate.password(password)

    return fetch(`${import.meta.env.VITE_API_URL}/users/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 200)
                return res.json()
                    .then((token: string) => {
                        sessionStorage.token = token
                        advanceSessionGeneration()
                    })

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = comErrors[error as keyof typeof comErrors]

                    throw new constructor(message)
                })
        })
}

export default loginUser
