import extractPayloadFromToken from '../util/extractPayloadFromToken'

const getUserId = () => {
    if (sessionStorage.token) {
        const payload = extractPayloadFromToken(sessionStorage.token)

        const { sub: userId } = payload

        return userId
    }

    return null
}
export default getUserId