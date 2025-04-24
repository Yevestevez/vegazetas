import mongoose from 'mongoose'
import authenticateUser from './authenticateUser.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            authenticateUser('ana@perez.com', '123123123')
                .then(result => console.log('user authenticated', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))