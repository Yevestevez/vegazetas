import mongoose from 'mongoose'
import 'dotenv/config'
import getRecipes from './getRecipes.js'

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        try {
            getRecipes('691b0596dfe2e03c2191f71f')
                .then(recipes => console.log('Recipes gotten', recipes))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))