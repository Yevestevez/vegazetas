import mongoose from 'mongoose'
import removeIngredientFromRecipe from './removeIngredientFromRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            removeIngredientFromRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                '67ecd5c6806bd1a46a2137b7' // ingredientId
            )
                .then(result => console.log('ingredient removed from recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })