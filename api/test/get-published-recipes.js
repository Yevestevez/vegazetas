fetch('http://localhost:8080/recipes/discover', {
    method: 'GET',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTFiMDU5NmRmZTJlMDNjMjE5MWY3MWUiLCJpYXQiOjE3NjQ3NDc4MjN9.tmTCtOqV-XSAtgFxynbjhP1gjo5mprGGJwIcaqwq1Ew'
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