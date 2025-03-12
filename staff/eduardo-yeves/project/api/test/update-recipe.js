fetch('http://localhost:8080/recipes/67d1e51c8bbaa07b840ebc52', {
    method: 'PATCH',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2QxY2Y1ODAxMzUzNDY2ZGM3ZTg5OWEiLCJpYXQiOjE3NDE4MDgxNDR9.3HnaaZpdfgJzRawD_oE6B2P7CDGY0ayTQ8K_LMyWPQ4',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'Tofu japonés',
        images: [
            'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg',
            'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'
        ],
        description: 'Otra descripción',
        time: 50,
        difficulty: 'medium',
        tags: ['tofu', 'arroz', 'PICANTE!']
    })
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