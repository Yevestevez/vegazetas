fetch('http://localhost:8080/recipes/67d1e22c0a6d935429466db4', {
    method: 'DELETE',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2QxY2Y1ODAxMzUzNDY2ZGM3ZTg5OWEiLCJpYXQiOjE3NDE4MDgxNDR9.3HnaaZpdfgJzRawD_oE6B2P7CDGY0ayTQ8K_LMyWPQ4',
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