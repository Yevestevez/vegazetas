import mongoose from 'mongoose'
import 'dotenv/config'

import toggleFavoriteRecipe from './toggleFavoriteRecipe.js'

const userId = '69282e8b7fdd2a1c2a526602'
const recipeId = '69282e8b7fdd2a1c2a526619'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        console.log('🌐 Conectado a MongoDB de test')

        return toggleFavoriteRecipe(userId, recipeId)
    })
    .then(user => {
        const userFav = user.favorites || []
        const isUserFav = userFav.includes(recipeId) ? 'FAVORITA' : 'NO FAVORITA'

        console.log(`🍽️ Receta ${recipeId} es ahora: ${isUserFav}`)
        console.log(`@${user.username} favorites:`, userFav)

        return mongoose.disconnect()
    })
    .catch(error => {
        console.error('❌ Error en test:', error)
        mongoose.disconnect()
    })