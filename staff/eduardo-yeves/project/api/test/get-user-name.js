fetch('http://localhost:8080/users/', {
    method: 'GET',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2M4MDYwNGMzMTBkM2NlYWZlYzMzMjciLCJpYXQiOjE3NDEzNTI5Njl9.mH6YX0z3pY79R3fA5v2DpHHqN8SXVsvjLhO_-V10PX8'
    }
})
    .then(res => {
        const { status } = res

        if (status === 200)
            return res.json()
                .then(body => console.log('OK', status, body))

        return res.json()
            .then(body => console.log('KO', status, body))
    })
    .catch(error => console.error(error))