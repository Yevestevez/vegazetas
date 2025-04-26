import mongoose from 'mongoose'
import addImageToRecipe from './addImageToRecipe.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            addImageToRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                'https://www.kwanhomsai.com/wp-content/uploads/2016/03/Como-preparar-arroz-Feat2.jpg', // image
            )
                .then(result => console.log('image added to recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })