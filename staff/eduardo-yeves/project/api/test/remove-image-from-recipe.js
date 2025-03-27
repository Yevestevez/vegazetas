fetch('http://localhost:8080/recipes/67e3f94465ad62473d8b3a99/images/https://imgs.search.brave.com/kNSwGkCuQCSYBLKzKmOSawR09HI1rdTXasdFk_XVmRA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9m/cmllZC10b2Z1XzEz/MzktMzI2NC5qcGc_/c2VtdD1haXNfaHli/cmlk', {
    method: 'DELETE',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2UyZjA5MTk4NjQzNTRhMGU2NDZlN2UiLCJpYXQiOjE3NDMxMDIwMjB9.EnaiXbcd3ajYximMoaSkzBrOhJ8UZa2FWtTk0zmUOtA',
        'Content-Type': 'application/json'
    }
})
    .then(res => {
        const { status } = res

        if (status === 204) {
            console.log('OK', status)

            return
        }

        return res.json()
            .then(body => console.log('KO', status, body))
    })
    .catch(error => console.error(error))