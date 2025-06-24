import mongoose from 'mongoose'
import addStepToRecipe from './addStepToRecipe.js'
import 'dotenv/config'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            // Test 1: Successful step addition
            console.log('Test 1: Add step to recipe successfully')
            addStepToRecipe(
                '6856e3a4815f336ea7140277', // userId
                '6856e3a4815f336ea714028e', // recipeId
                'Este es un paso para elaborar la receta', // text
                'Una aclaración o anotación al paso', // note
                'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg' // image
            )
                .then(result => console.log('step added to recipe successfully:', result))
                .catch(error => console.error('Test 1 failed:', error.message))
                .then(() => {
                    // Test 2: Add step without optional fields
                    console.log('\nTest 2: Add step without note and image')
                    return addStepToRecipe(
                        '6856e3a4815f336ea7140277',
                        '6856e3a4815f336ea714028e',
                        'Paso sin nota ni imagen'
                    )
                })
                .then(result => console.log('step added without optional fields:', result))
                .catch(error => console.error('Test 2 failed:', error.message))
                .then(() => {
                    // Test 3: Error - user not found
                    console.log('\nTest 3: Error - user not found')
                    return addStepToRecipe(
                        '000000000000000000000000', // non-existent userId
                        '6856e3a4815f336ea714028e',
                        'Este paso no debería añadirse'
                    )
                })
                .then(() => console.error('Test 3 should have failed'))
                .catch(error => console.log('Test 3 failed as expected:', error.message))
                .then(() => {
                    // Test 4: Error - recipe not found
                    console.log('\nTest 4: Error - recipe not found')
                    return addStepToRecipe(
                        '6856e3a4815f336ea7140277',
                        '000000000000000000000000', // non-existent recipeId
                        'Este paso no debería añadirse'
                    )
                })
                .then(() => console.error('Test 4 should have failed'))
                .catch(error => console.log('Test 4 failed as expected:', error.message))
                .then(() => {
                    // Test 5: Error - user is not recipe author
                    console.log('\nTest 5: Error - user is not recipe author')
                    return addStepToRecipe(
                        '6856e3a4815f336ea7140278', // different userId
                        '6856e3a4815f336ea714028e',
                        'Este paso no debería añadirse'
                    )
                })
                .then(() => console.error('Test 5 should have failed'))
                .catch(error => console.log('Test 5 failed as expected:', error.message))
        } catch (error) {
            console.error('Test setup failed:', error)
        }
    })
    .catch(error => console.error('Database connection failed:', error))