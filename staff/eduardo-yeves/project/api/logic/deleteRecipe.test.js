import mongoose from 'mongoose'
import deleteRecipe from './deleteRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            deleteRecipe(
                '67d1cf5801353466dc7e899a', // userId
                '67d1cf5801353466dc7e899e', // recipeId
            )
                .then(result => console.log('recipe deleted', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })