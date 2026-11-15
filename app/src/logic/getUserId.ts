import extractPayloadFromToken from '../util/extractPayloadFromToken'

const getUserId = (): string | null => {
    if (sessionStorage.token) {
        const payload = extractPayloadFromToken(sessionStorage.token)

        const { sub: userId } = payload

        return userId ?? null
    }

    return null
}
export default getUserId
