import mongoose from 'mongoose'
import addIngredientToRecipe from './addIngredientToRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            addIngredientToRecipe(
                '67d1cf5801353466dc7e899a', // userId
                '67dc62da801658ed71cff7d9', // recipeId
                'Tofu', // name
                200, // quantity
                'g', // unit
                'nota', // annotation
                true // main
            )
                .then(result => console.log('ingredient added to recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })