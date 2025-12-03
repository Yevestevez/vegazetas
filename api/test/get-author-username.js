fetch('http://localhost:8080/recipes/69300b4826c169e343d5d7c1/author', {
    method: 'GET',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTFiMDU5NmRmZTJlMDNjMjE5MWY3MWYiLCJpYXQiOjE3NjQ3NjMyNDZ9.sX_eOG9Fvp-3B9JmgEgnCZ1zdLxGXa-XymdplKA6lw0'
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