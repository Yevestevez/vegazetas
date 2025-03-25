fetch('http://localhost:8080/users/username', {
    method: 'GET',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2UwM2JmOTY3NTA0MWUzN2QxZGUzMGEiLCJpYXQiOjE3NDI5MDEwMzZ9.5_NQOnwuqbm7PLIhJ1ZtOacpovEbvE4S9TBhQXqn5ok'
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