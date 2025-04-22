import mongoose from 'mongoose'
import updateRecipe from './updateRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            updateRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                'Tofu chino', // title
                'Descripción de la receta', // description
                50, // time
                'medium', // difficulty (easy | medium | difficult)
            )
                .then(result => console.log('recipe updated', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))