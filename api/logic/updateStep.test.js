import mongoose from 'mongoose'
import updateStep from './updateStep.js'
import 'dotenv/config'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            updateStep(
                '6856e3a4815f336ea7140277', // userId
                '6856e3a4815f336ea714028e', // recipeId
                '6856e3a4815f336ea7140286', // stepId
                'Secar tofu y sofreír con un toque de sal y pimienta (actualizado)', // text
                'Nueva nota actualizada', // note
                '', // image
            )
                .then(result => console.log('step updated', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))