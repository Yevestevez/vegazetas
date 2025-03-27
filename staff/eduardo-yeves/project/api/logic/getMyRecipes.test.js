import mongoose from 'mongoose'
import getMyRecipes from './getMyRecipes.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getMyRecipes('67e2f0919864354a0e646e7e')
                .then(recipes => console.log('my recipes gotten', recipes))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))