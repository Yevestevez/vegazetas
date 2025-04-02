import mongoose from 'mongoose'
import deleteRecipe from './deleteRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            deleteRecipe(
                '67ea59a5ecbab7201125cbc7', // userId
                '67ed0013beb8ebfa65f8b216', // recipeId
            )
                .then(result => console.log('recipe deleted', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })