import mongoose from 'mongoose'
import 'dotenv/config'
import recoverPassword from './recoverPassword.js'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            recoverPassword('edu@yeves.com')
                .then(result => console.log('recover email requested and send', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))