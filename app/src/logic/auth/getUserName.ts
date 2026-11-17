import authenticatedFetch from '../authenticatedFetch'
import { errors as comErrors } from 'com'

const getUserName = (): Promise<string> => {
    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/users/name`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        },
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 200)
                return res.json()
                    .then((name: string) => name)

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = comErrors[error as keyof typeof comErrors]

                    throw new constructor(message)
                })
        })
}

export default getUserName
