import mongoose from 'mongoose'
import createRecipe from './createRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            createRecipe(
                '67e03bf9675041e37d1de30b', // userId
                'Título de prueba', // title
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