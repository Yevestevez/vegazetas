import mongoose from 'mongoose'
import getUserUsername from './getUserUsername.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            getUserUsername('67ea59a5ecbab7201125cbc7')
                .then(result => console.log('username:', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))