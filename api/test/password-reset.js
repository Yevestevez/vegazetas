const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODE2MDE1ZGEyMmFlYWUwNTFkODAxODEiLCJpYXQiOjE3NDk3NDQ2NTQsImV4cCI6MTc0OTc0NTU1NH0.IsYugu4xcA_Ig9k8Xt1oMaTN_Ryf-BwhDl6wSFs1Qjc'
const newPassword = 'c123123123'

fetch(`http://localhost:8080/users/password/reset/${token}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newPassword })
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