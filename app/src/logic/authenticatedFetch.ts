export const SESSION_EXPIRED_EVENT = 'vegazetas:session-expired'

let sessionGeneration = 0

export const advanceSessionGeneration = () => { sessionGeneration += 1 }

const authenticatedFetch = (
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> => {
    const requestGeneration = sessionGeneration
    const token = sessionStorage.token || null

    return fetch(input, init).then(response => {
        if (
            response.status === 401 &&
            requestGeneration === sessionGeneration &&
            (sessionStorage.token || null) === token
        ) {
            if (token) delete sessionStorage.token
            sessionGeneration += 1
            window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
        }

        return response
    })
}

export default authenticatedFetch
