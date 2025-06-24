import mongoose from 'mongoose'
import reorderStep from './reorderStep.js'
import 'dotenv/config'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            // Test successful reordering of a middle step upwards
            console.log('Test 1: Move middle step up')
            reorderStep(
                '6856e3a4815f336ea7140277', // userId
                '6856e3a4815f336ea714028e', // recipeId
                '6856e3a4815f336ea7140289', // stepId
                'up' // direction
            )
                .then(() => console.log('step reordered up successfully'))
                .catch(error => console.error('Test 1 failed:', error.message))
                .then(() => {
                    // Test successful reordering of a middle step downwards
                    console.log('\nTest 2: Move middle step down')
                    return reorderStep(
                        '6856e3a4815f336ea7140277',
                        '6856e3a4815f336ea714028e',
                        '6856e3a4815f336ea7140289',
                        'down'
                    )
                })
                .then(() => console.log('step reordered down successfully'))
                .catch(error => console.error('Test 2 failed:', error.message))
                .then(() => {
                    // Test attempt to move first step up (should not change order)
                    console.log('\nTest 3: Try to move first step up')
                    return reorderStep(
                        '6856e3a4815f336ea7140277',
                        '6856e3a4815f336ea714028e',
                        '6856e3a4815f336ea7140286', // first step id
                        'up'
                    )
                })
                .then(() => console.log('first step remains in position as expected'))
                .catch(error => console.error('Test 3 failed:', error.message))
                .then(() => {
                    // Test attempt to move last step down (should not change order)
                    console.log('\nTest 4: Try to move last step down')
                    return reorderStep(
                        '6856e3a4815f336ea7140277',
                        '6856e3a4815f336ea714028e',
                        '6856e3a4815f336ea714028d', // last step id
                        'down'
                    )
                })
                .then(() => console.log('last step remains in position as expected'))
                .catch(error => console.error('Test 4 failed:', error.message))
                .then(() => {
                    // Test with non-existent user
                    console.log('\nTest 5: Error - user not found')
                    return reorderStep(
                        '000000000000000000000000', // non-existent userId
                        '6856e3a4815f336ea714028e',
                        '6856e3a4815f336ea7140289',
                        'up'
                    )
                })
                .then(() => console.error('Test 5 should have failed'))
                .catch(error => console.log('Test 5 failed as expected:', error.message))
                .then(() => {
                    // Test with non-existent recipe
                    console.log('\nTest 6: Error - recipe not found')
                    return reorderStep(
                        '6856e3a4815f336ea7140277',
                        '000000000000000000000000', // non-existent recipeId
                        '6856e3a4815f336ea7140289',
                        'up'
                    )
                })
                .then(() => console.error('Test 6 should have failed'))
                .catch(error => console.log('Test 6 failed as expected:', error.message))
                .then(() => {
                    // Test with non-existent step
                    console.log('\nTest 7: Error - step not found')
                    return reorderStep(
                        '6856e3a4815f336ea7140277',
                        '6856e3a4815f336ea714028e',
                        '000000000000000000000000', // non-existent stepId
                        'up'
                    )
                })
                .then(() => console.error('Test 7 should have failed'))
                .catch(error => console.log('Test 7 failed as expected:', error.message))
                .then(() => {
                    // Test with unauthorized user (not recipe author)
                    console.log('\nTest 8: Error - user is not recipe author')
                    return reorderStep(
                        '6856e3a4815f336ea7140278', // different userId
                        '6856e3a4815f336ea714028e',
                        '6856e3a4815f336ea7140289',
                        'up'
                    )
                })
                .then(() => console.error('Test 8 should have failed'))
                .catch(error => console.log('Test 8 failed as expected:', error.message))
        } catch (error) {
            console.error('Test setup failed:', error)
        }
    })
    .catch(error => console.error('Database connection failed:', error))