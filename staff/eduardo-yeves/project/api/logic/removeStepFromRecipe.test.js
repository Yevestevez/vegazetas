import mongoose from 'mongoose'
import removeStepFromRecipe from './removeStepFromRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            removeStepFromRecipe(
                '67d1cf5801353466dc7e899a', // userId
                '67d1e51c8bbaa07b840ebc52', // recipeId
                '67d289b522fef16bec5628ff' // stepId
            )
                .then(result => console.log('step removed from recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })