import mongoose from 'mongoose'
import createRecipe from './createRecipe.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            createRecipe(
                '67ea59a5ecbab7201125cbc7', // userId
                'Título de prueba3', // title
                ['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg', 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'], // images
                'Descripción de prueba', // description
                35 // time
                // 'easy', // difficulty (easy | medium | difficult)
                // ['tofu', 'coreano', 'arroz', 'picante'], // tags
            )
                .then(result => console.log('recipe created', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))