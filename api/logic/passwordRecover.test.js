import mongoose from 'mongoose'
import '../config/loadEnv.js'
import { passwordRecover } from '../modules/users/passwordRecover/composition.ts'

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        try {
            passwordRecover('edu@yeves.com')
                .then(() => console.log('recover email requested and send'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))