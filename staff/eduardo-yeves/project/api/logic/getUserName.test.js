import mongoose from 'mongoose'
import getUserName from './getUserName.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getUserName('67c80604c310d3ceafec3327')
                .then(result => console.log('user name:', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))