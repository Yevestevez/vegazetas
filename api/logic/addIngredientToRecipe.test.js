import mongoose from 'mongoose'
import addIngredientToRecipe from './addIngredientToRecipe.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            addIngredientToRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                'Orégano', // name
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