fetch('http://localhost:8080/recipes/67ea945619ca1fadc87e88d3/images', {
    method: 'POST',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MDg4NzZ9.oPmfXPlILgeIHpSFvfcplOUVrFjbZa4jZinDa_qgjNg',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        image: 'https://www.kwanhomsai.com/wp-content/uploads/2016/03/Como-preparar-arroz-Feat2.jpg'
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