import mongoose from 'mongoose'
import addStepToRecipe from './addStepToRecipe.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            addStepToRecipe(
                '67ea59a5ecbab7201125cbc8', // userId
                '67ea945619ca1fadc87e88d3', // recipeId
                'Este es un paso para elaborar la recera', // text
                'Una aclaración o anotación al paso', // note
                'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg' // image
            )
                .then(result => console.log('step added to recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })