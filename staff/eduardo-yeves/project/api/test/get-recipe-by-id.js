fetch('http://localhost:8080/recipes/67e03bf9675041e37d1de321', {
    method: 'GET',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2UwM2JmOTY3NTA0MWUzN2QxZGUzMGEiLCJpYXQiOjE3NDI4ODg2NTB9.VOcWhIHatzQZGjwenEAn6qzNYn9C_dtCRhOQRJoHF_w'
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