import { errors } from 'com'

const handleCredentialsError = error => error instanceof errors.CredentialsError

export default handleCredentialsError
