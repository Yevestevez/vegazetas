import extractPayloadFromToken from '../util/extractPayloadFromToken'

const isUserLoggedIn = () => {
    const token = sessionStorage.token
    if (!token) return false

    try {
        const { exp } = extractPayloadFromToken(token)
        if (typeof exp === 'number' && exp * 1000 > Date.now()) return true

        delete sessionStorage.token
        return false
    } catch {
        return true
    }
}

export default isUserLoggedIn