import mongoose from 'mongoose'
import 'dotenv/config'
import getFavoritesRecipes from './getFavoritesRecipes.js'

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        try {
            getFavoritesRecipes('691b0596dfe2e03c2191f71e')
                .then(recipes => console.log('Recipes gotten', recipes))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))