import { advanceSessionGeneration } from '../authenticatedFetch'

const logoutUser = (): void => {
    delete sessionStorage.token
    advanceSessionGeneration()
}

export default logoutUser
