import mongoose from 'mongoose'
import createRecipe from './createRecipe.js'
import { Step } from '../data/models.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            createRecipe(
                '67d032b5916bd56597cb6ead', // userId
                'Tofu coreano 10', // title
                ['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg', 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'], // images
                'Descripción de la receta', // description
                35, // time
                'easy', // difficulty (easy | medium | difficult)
                ['tofu', 'coreano', 'arroz', 'picante'], // tags
                ['tofu', 'arroz', 'cebolla', 'salsa de soja'], // ingredients
                [{ text: 'sofríe el tofu!' }] // steps
            )
                .then(result => console.log('recipe created', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))