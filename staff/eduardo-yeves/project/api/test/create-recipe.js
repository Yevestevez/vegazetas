fetch('http://localhost:8080/recipes', {
    method: 'POST',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2UyZjA5MTk4NjQzNTRhMGU2NDZlN2UiLCJpYXQiOjE3NDI5MzA3ODR9.vdgitsvU4RwiDQHV8gKai94V6DkqEFZjqGG7cmmMGaU',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'Tofu coreano51',
        images: [
            'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg',
            'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'
        ],
        description: 'Descripción de la receta',
        time: 35,
        difficulty: 'easy',
        tags: ['tofu', 'coreano', 'arroz', 'picante'],
        ingredients: ['tofu', 'arroz', 'cebolla', 'salsa de soja'],
        steps: [{ text: 'sofríe la cebolla con un poco de aceite' }]
    })
})
    .then(res => {
        const { status } = res

        if (status === 201) {
            return res.json()
                .then(body => console.log('OK', status, body))
        }

        return res.json()
            .then(body => console.log('KO', status, body))
    })
    .catch(error => console.error(error))