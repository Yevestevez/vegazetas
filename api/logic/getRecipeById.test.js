import mongoose from 'mongoose'
import getRecipeById from './getRecipeById.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getRecipeById('67ea59a5ecbab7201125cbc7', '67ea59a5ecbab7201125cbde')
                .then(recipe => console.log('recipe gotten', recipe))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))