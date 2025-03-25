import mongoose from 'mongoose'
import getRecipeById from './getRecipeById.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getRecipeById('67e03bf9675041e37d1de30a', '67e03bf9675041e37d1de321')
                .then(recipe => console.log('recipe gotten', recipe))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))