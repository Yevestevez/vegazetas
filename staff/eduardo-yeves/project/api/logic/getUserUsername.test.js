import mongoose from 'mongoose'
import getUserUsername from './getUserUsername.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getUserUsername('67e03bf9675041e37d1de30a')
                .then(result => console.log('username:', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))