import mongoose from 'mongoose'
import addStepToRecipe from './addStepToRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            addStepToRecipe(
                '67d1cf5801353466dc7e899a', // userId
                '67d1e51c8bbaa07b840ebc52', // recipeId
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