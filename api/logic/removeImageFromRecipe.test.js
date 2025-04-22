import mongoose from 'mongoose'
import removeImageFromRecipe from './removeImageFromRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            removeImageFromRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                0 // imageIndex
            )
                .then(result => console.log('image removed from recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })