interface JwtPayload {
    sub?: string
    exp?: number
    [key: string]: unknown
}

function extractPayloadFromToken(token: string): JwtPayload {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) throw new Error('invalid token')

    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payloadJSON = atob(payloadB64.padEnd(Math.ceil(payloadB64.length / 4) * 4, '='))
    const payload = JSON.parse(payloadJSON)

    return payload
}

export default extractPayloadFromToken
