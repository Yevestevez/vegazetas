import mongoose from 'mongoose'
import addIngredientToRecipe from './addIngredientToRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            addIngredientToRecipe(
                '67d08601ce598de12b0e7414', // recipeId
                'Salsa Sriracha', // name
                2, // quantity
                'g', // unit
                'Picante!', // annotation
                true // main
            )
                .then(result => console.log('ingredient added to recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })