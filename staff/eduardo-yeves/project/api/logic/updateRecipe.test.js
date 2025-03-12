import mongoose from 'mongoose'
import updateRecipe from './updateRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            updateRecipe(
                '67d1cf5801353466dc7e899a', // userId
                '67d1e51c8bbaa07b840ebc52', // recipeId
                'Tofu chino', // title
                ['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg'], // images
                'Descripción de la receta', // description
                50, // time
                'medium', // difficulty (easy | medium | difficult)
                ['tofu', 'chino'] // tags
            )
                .then(result => console.log('recipe updated', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))