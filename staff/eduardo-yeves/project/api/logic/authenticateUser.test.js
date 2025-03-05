import mongoose from 'mongoose'
import authenticateUser from './authenticateUser.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            authenticateUser('edu@yeves.com', '123123123')
                .then(result => console.log('user authenticated', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))