fetch('http://localhost:8080/users/favorites/692731c8278b4e53feae2d42', {
    method: 'PATCH',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTFiMDU5NmRmZTJlMDNjMjE5MWY3MWYiLCJpYXQiOjE3NjU0NDkwOTR9.Ov5zA3R7JLDIZjucPR6hsDtbxUA1_KeqJiWf35z6YRQ',
        'Content-Type': 'application/json'
    }
})
    .then(res => {
        const { status } = res

        if (status === 200) {
            return res.json().then(body => {
                console.log('OK', status, body)
            })
        }

        return res.json()
            .then(body => console.log('KO', status, body))
    })
    .catch(error => console.error(error))