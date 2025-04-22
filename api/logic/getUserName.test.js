import mongoose from 'mongoose'
import getUserName from './getUserName.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            getUserName('67d085c48f8bef38f0adc8db')
                .then(result => console.log('user name:', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))