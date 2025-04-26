import mongoose from 'mongoose'
import removeTagFromRecipe from './removeTagFromRecipe.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            removeTagFromRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                0 // tagIndex
            )
                .then(result => console.log('tag removed from recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })