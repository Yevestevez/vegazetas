import mongoose from 'mongoose'
import getUserUsername from './getUserUsername.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
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