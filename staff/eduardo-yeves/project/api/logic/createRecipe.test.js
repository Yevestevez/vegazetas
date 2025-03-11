import mongoose from 'mongoose'
import createRecipe from './createRecipe.js'
import { Step } from '../data/models.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        const paso1 = new Step({ text: 'Sofríe la cebolla' })

        try {
            createRecipe(
                '67c99c6fb452e8eec2c951e3', // userId
                'Tofu coreano', // title
                ['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg', 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'], // images
                'Descripción de la receta', // description
                35, // time
                'easy', // difficulty (easy | medium | difficult)
                ['tofu', 'coreano', 'arroz', 'picante'], // tags
                ['tofu', 'arroz', 'cebolla', 'salsa de soja'], // ingredients
                [paso1] // steps (se introducen desde el modelo de MongoDB 'Step')
            )
                .then(result => console.log('recipe created', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))