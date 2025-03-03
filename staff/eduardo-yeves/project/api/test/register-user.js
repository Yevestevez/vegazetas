fetch('http://localhost:8080/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: '{"name":"Edu Yeves","email":"edu@yeves","username":"eduyeves","password":"123123123"}'
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