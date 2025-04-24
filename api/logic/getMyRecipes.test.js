import mongoose from 'mongoose'
import getMyRecipes from './getMyRecipes.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            getMyRecipes('67ea59a5ecbab7201125cbc7')
                .then(recipes => console.log('my recipes gotten', recipes))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))