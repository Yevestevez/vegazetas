import mongoose from 'mongoose'
import getRecipeById from './getRecipeById.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getRecipeById('67e2f0919864354a0e646e7e', '67e2f0919864354a0e646e95')
                .then(recipe => console.log('recipe gotten', recipe))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))