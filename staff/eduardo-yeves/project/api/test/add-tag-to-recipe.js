fetch('http://localhost:8080/recipes/67e2f400835b20c641d56c5e/tags', {
    method: 'POST',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2UyZjA5MTk4NjQzNTRhMGU2NDZlN2UiLCJpYXQiOjE3NDI5ODQzNzF9.HtiJbGIW45IxfGmy4g0vZdIBzgBLY9Me_0QVeNyvmxM',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        tag: 'arroz'
    })
})
    .then(res => {
        const { status } = res

        if (status === 201) {
            console.log('OK', status)

            return
        }

        return res.json()
            .then(body => console.log('KO', status, body))
    })
    .catch(error => console.error(error))