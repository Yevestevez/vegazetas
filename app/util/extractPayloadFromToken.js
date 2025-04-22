function extractPayloadFromToken(token) {
    var firstDotIndex = token.indexOf('.')
    var lastDotIndex = token.lastIndexOf('.')

    var payloadB64 = token.slice(firstDotIndex + 1, lastDotIndex)
    var payloadJSON = atob(payloadB64)
    var payload = JSON.parse(payloadJSON)

    return payload
}

export default extractPayloadFromToken