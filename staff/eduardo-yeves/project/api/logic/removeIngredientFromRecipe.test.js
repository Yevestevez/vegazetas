import mongoose from 'mongoose'
import removeIngredientFromRecipe from './removeIngredientFromRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            removeIngredientFromRecipe(
                '67d1cf5801353466dc7e899a', // userId
                '67d1cf5801353466dc7e899e', // recipeId
                '67d1cf5801353466dc7e899c' // ingredientId
            )
                .then(result => console.log('ingredient removed from recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })