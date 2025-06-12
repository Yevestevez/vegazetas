fetch('http://localhost:8080/users/password/recover', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: '{"email":"edu@yeves.com"}'
})
    .then(res => {
        const { status } = res

        if (status === 200) {
            console.log('OK', status)

            return
        }

        return res.json()
            .then(body => console.log('KO', status, body))
    })
    .catch(error => console.error(error))