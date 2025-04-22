fetch('http://localhost:8080/recipes/67ed668643f78566e72b4876', {
    method: 'GET',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MTE0ODh9.Mh6Ced7GwQABgzLRvYy1NmLZT-bcjKyZ-KCVRy5lgMk'
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