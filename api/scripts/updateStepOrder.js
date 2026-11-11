import '../config/loadEnv.js'
import mongoose from 'mongoose'
import { Recipe } from '../data/models.js'

const mode = process.argv[2]  // "dev" o "prod" node scripts/updateStepOrder.js prod o node scripts/updateStepOrder.js dev
const isDryRun = process.argv.includes('--dry') // node scripts/updateStepOrder.js dev --dry

const uri = mode === 'prod'
    ? process.env.MONGO_URL_PROD
    : process.env.MONGO_URL

if (!uri) {
    console.error('❌ URI no definida en el .env')
    process.exit(1)
}

mongoose.connect(uri)
    .then(async () => {
        console.log(`🌐 Conectado a MongoDB (${mode})`)

        const recipes = await Recipe.find()
        let totalUpdated = 0
        let totalSkipped = 0

        for (const recipe of recipes) {
            let updated = false

            recipe.steps = recipe.steps.map((step, index) => {
                // El objeto step es un subdocumento, no siempre tiene toObject() si accedemos directamente
                // Para evitar problemas, usamos una copia manual:
                if (step.order === undefined) {
                    updated = true
                    return {
                        ...step.toObject ? step.toObject() : step,
                        order: index
                    }
                }
                return step
            })

            if (updated) {
                totalUpdated++
                console.log(`📝 ${isDryRun ? '[Simulado]' : '[Actualizado]'}: ${recipe.title}`)
                if (!isDryRun) {
                    await recipe.save()
                }
            } else {
                totalSkipped++
            }
        }

        console.log(`\n✅ Recetas modificadas: ${totalUpdated}`)
        console.log(`⏭️  Recetas sin cambios: ${totalSkipped}`)
        if (isDryRun) {
            console.log('🔍 DRY RUN: No se han hecho cambios en la base de datos.')
        }

        mongoose.disconnect()
    })
    .catch(err => {
        console.error('❌ Error:', err)
        mongoose.disconnect()
    })