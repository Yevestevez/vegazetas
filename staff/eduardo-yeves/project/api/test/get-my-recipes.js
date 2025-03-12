fetch('http://localhost:8080/recipes/', {
    method: 'GET',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2QwODVjNDhmOGJlZjM4ZjBhZGM4ZGIiLCJpYXQiOjE3NDE3NzcxMTJ9.vx54_bqswy7nrgiFywReSiByVs5whwYAraIv-wySytM'
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