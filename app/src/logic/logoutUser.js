import { advanceSessionGeneration } from './authenticatedFetch'

const logoutUser = () => {
    delete sessionStorage.token
    advanceSessionGeneration()
}

export default logoutUser