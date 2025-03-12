import mongoose from 'mongoose'
import createIngredientsInRecipe from './createIngredientsInRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            createIngredientsInRecipe(
                '67d08601ce598de12b0e7414', // recipeId
                [
                    { name: 'ajo', quantity: 2, main: false },
                    { name: 'tomate', quantity: 200, unit: 'g', main: true }
                ]
            )
                .then(result => console.log('ingredients created in recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })