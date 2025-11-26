import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Recipe } from '../data/models.js'

dotenv.config()

const mode = process.argv[2] // "dev" o "prod" node scripts/updatePublished.js prod o node scripts/updatePublished.js dev
const isDryRun = process.argv.includes('--dry') // node scripts/updatePublished.js dev --dry

const uri = mode === 'prod'
    ? process.env.MONGO_URL_PROD
    : process.env.MONGO_URL

if (!uri) {
    console.error('❌ URI no definida en el .env')
    process.exit(1)
}

async function run() {
    try {
        await mongoose.connect(uri)
        console.log(`🌐 Conectado a MongoDB (${mode})\n`)

        const missingCount = await Recipe.countDocuments({ published: { $exists: false } })
        console.log(`🔍 Recetas sin "published": ${missingCount}`)

        if (missingCount === 0) {
            console.log("Nada que actualizar")
            await mongoose.disconnect()
            return
        }

        if (isDryRun) {
            console.log("🧪 DRY RUN: No se aplicarán cambios")
            await mongoose.disconnect()
            return
        }

        const result = await Recipe.updateMany(
            { published: { $exists: false } },
            { $set: { published: false } }
        )

        console.log(`Actualizadas: ${result.modifiedCount}`)
        console.log(`Sin cambios: ${result.matchedCount - result.modifiedCount}`)

        await mongoose.disconnect()
        console.log("✔ Conexión con BBDD cerrada")

    } catch (err) {
        console.error("❌ Error:", err)
        await mongoose.disconnect()
    }
}

run()