import mongoose from 'mongoose'
import addTagToRecipe from './addTagToRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            addTagToRecipe(
                '67e03bf9675041e37d1de30a', // userId
                '67e191089c44bea5604aa6c5', // recipeId
                'arroz', // tag
            )
                .then(result => console.log('tag added to recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })