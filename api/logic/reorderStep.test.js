import mongoose from 'mongoose'
import reorderStep from './reorderStep.js'

import 'dotenv/config'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            // Test 1: Mover paso hacia arriba
            console.log('=== Test 1: Moving step UP ===')
            reorderStep(
                '6855579a661027cb6647eb71', // recipeId
                '6855579a661027cb6647eb6b', // stepId (paso a mover)
                'up' // direction
            )
                .then(result => console.log('Step moved UP successfully', result))
                .catch(error => console.error('Error moving UP:', error))

            // Test 2: Mover paso hacia abajo
            setTimeout(() => {
                console.log('\n=== Test 2: Moving step DOWN ===')
                reorderStep(
                    '6855579a661027cb6647eb71', // recipeId
                    '6855579a661027cb6647eb6b', // stepId (paso a mover)
                    'down' // direction
                )
                    .then(result => console.log('Step moved DOWN successfully', result))
                    .catch(error => console.error('Error moving DOWN:', error))
            }, 1000)

            // Test 3: Error - Recipe not found
            setTimeout(() => {
                console.log('\n=== Test 3: Recipe not found ===')
                reorderStep(
                    '000000000000000000000000', // recipeId inexistente
                    '6855579a661027cb6647eb6b', // stepId
                    'up'
                )
                    .then(result => console.log('Unexpected success:', result))
                    .catch(error => console.error('Expected error - Recipe not found:', error.message))
            }, 2000)

            // Test 4: Error - Step not found
            setTimeout(() => {
                console.log('\n=== Test 4: Step not found ===')
                reorderStep(
                    '6855579a661027cb6647eb71', // recipeId válido
                    '000000000000000000000000', // stepId inexistente
                    'up'
                )
                    .then(result => console.log('Unexpected success:', result))
                    .catch(error => console.error('Expected error - Step not found:', error.message))
            }, 3000)

            // Test 5: Edge case - Trying to move first step up
            setTimeout(() => {
                console.log('\n=== Test 5: Move first step UP (should do nothing) ===')
                reorderStep(
                    '6855579a661027cb6647eb71', // recipeId
                    '6855579a661027cb6647eb69', // stepId del primer paso
                    'up'
                )
                    .then(result => console.log('First step UP (no change expected):', result))
                    .catch(error => console.error('Error with first step UP:', error))
            }, 4000)

            // Test 6: Edge case - Trying to move last step down
            setTimeout(() => {
                console.log('\n=== Test 6: Move last step DOWN (should do nothing) ===')
                reorderStep(
                    '6855579a661027cb6647eb71', // recipeId
                    '6855579a661027cb6647eb70', // stepId del último paso
                    'down'
                )
                    .then(result => console.log('Last step DOWN (no change expected):', result))
                    .catch(error => console.error('Error with last step DOWN:', error))

                // Cerrar conexión después del último test
                setTimeout(() => {
                    mongoose.connection.close()
                    console.log('\n=== Tests completed ===')
                }, 1000)
            }, 5000)

        } catch (error) {
            console.error('Sync error:', error)
        }
    })
    .catch(error => console.error('Connection error:', error))