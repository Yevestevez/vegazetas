fetch('http://localhost:8080/recipes/67ea945619ca1fadc87e88d3/ingredients', {
    method: 'POST',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MDg4NzZ9.oPmfXPlILgeIHpSFvfcplOUVrFjbZa4jZinDa_qgjNg',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Aceite de oliva',
        quantity: 100,
        unit: 'ml',
        annotation: 'AOVE',
        main: false
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