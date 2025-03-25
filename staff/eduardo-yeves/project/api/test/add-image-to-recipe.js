fetch('http://localhost:8080/recipes/67e1972d9c44bea5604aa6e6/images', {
    method: 'POST',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2UwM2JmOTY3NTA0MWUzN2QxZGUzMGEiLCJpYXQiOjE3NDI5MDU2NjJ9.thH8d-l2ZYf4wlsh0hDDNvHRKc1WS1yw-LO8UAI4zfU',
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