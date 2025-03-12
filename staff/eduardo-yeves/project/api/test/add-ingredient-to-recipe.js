fetch('http://localhost:8080/recipes/67d1cf5801353466dc7e899e/ingredients', {
    method: 'POST',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2QxY2Y1ODAxMzUzNDY2ZGM3ZTg5OWEiLCJpYXQiOjE3NDE4MDQxNjN9.NZfpEdsjG_GyyhzrBg07s9mIY4RMLs59qLMAKuHPup4',
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