import mongoose from 'mongoose'
import registerUser from './registerUser.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            registerUser('Eduardo Yeves', 'edu@yeves.com', 'eduyeves', '123123123')
                .then(result => console.log('user registered', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))