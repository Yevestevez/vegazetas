import mongoose from 'mongoose'
import getMyRecipes from './getMyRecipes.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getMyRecipes('67d085c48f8bef38f0adc8db')
                .then(recipes => console.log('my recipes gotten', recipes))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))