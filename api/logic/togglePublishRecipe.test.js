import mongoose from 'mongoose'
import '../config/loadEnv.js'

import togglePublishRecipe from './togglePublishRecipe.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        console.log('🌐 Conectado a MongoDB de test')

        const userId = '69282e8b7fdd2a1c2a526602'    // reemplaza con un userId de test válido
        const recipeId = '69282e8b7fdd2a1c2a526619'  // reemplaza con un recipeId de test válido

        try {
            togglePublishRecipe(userId, recipeId)
                .then(({ published }) => {
                    console.log(`✅ Receta actualizada: published = ${published}`)
                })
                .catch(error => {
                    console.error('❌ Error en togglePublishRecipe:', error)
                })
        } catch (error) {
            console.error('❌ Error inesperado:', error)
        }
    })
    .catch(error => {
        console.error('❌ Error conectando a MongoDB:', error)
    })