import { errors } from 'com'
import logoutUser from '../../logic/logoutUser'

const handleCredentialsError = (error, alert, onUserLoggedOut) => {
    if (!(error instanceof errors.CredentialsError)) return false

    logoutUser()
    onUserLoggedOut()
    alert('Tu sesión no es válida o ha caducado. Inicia sesión de nuevo.')
    return true
}

export default handleCredentialsError
