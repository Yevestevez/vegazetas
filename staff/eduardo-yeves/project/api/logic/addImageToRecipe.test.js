import mongoose from 'mongoose'
import addImageToRecipe from './addImageToRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            addImageToRecipe(
                '67e03bf9675041e37d1de30a', // userId
                '67e191089c44bea5604aa6c5', // recipeId
                'https://www.kwanhomsai.com/wp-content/uploads/2016/03/Como-preparar-arroz-Feat2.jpg', // image
            )
                .then(result => console.log('image added to recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })