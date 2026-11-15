import { errors } from 'com'

const handleCredentialsError = (error: unknown, alert: (message: string) => void, onUserLoggedOut: () => void): boolean => {
    if (error instanceof errors.CredentialsError) {
        onUserLoggedOut()
        return true
    }
    return false
}

export default handleCredentialsError
