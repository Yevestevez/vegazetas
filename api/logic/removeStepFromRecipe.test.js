import mongoose from 'mongoose'
import removeStepFromRecipe from './removeStepFromRecipe.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            removeStepFromRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                '67ecdb271ae3be46e595476b' // stepId
            )
                .then(result => console.log('step removed from recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })