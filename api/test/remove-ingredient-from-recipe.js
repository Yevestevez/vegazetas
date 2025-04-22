fetch('http://localhost:8080/recipes/67ea59a5ecbab7201125cbde/ingredients/67ea59a5ecbab7201125cbc9', {
    method: 'DELETE',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MTE0ODh9.Mh6Ced7GwQABgzLRvYy1NmLZT-bcjKyZ-KCVRy5lgMk',
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