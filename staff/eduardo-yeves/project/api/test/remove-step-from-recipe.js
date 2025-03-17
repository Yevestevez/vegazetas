fetch('http://localhost:8080/recipes/67d1e51c8bbaa07b840ebc52/steps/67d284dbdec4e4e887d6bf95', {
    method: 'DELETE',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2QxY2Y1ODAxMzUzNDY2ZGM3ZTg5OWEiLCJpYXQiOjE3NDE4NjA5NDh9.mBjLsUtDzJY141Xihc6as5n0DHXHHh5SLy9VQg3Ryrw',
        'Content-Type': 'application/json'
    }
})
    .then(res => {
        const { status } = res

        if (status === 204) {
            console.log('OK', status)

            return
        }

        return res.json()
            .then(body => console.log('KO', status, body))
    })
    .catch(error => console.error(error))