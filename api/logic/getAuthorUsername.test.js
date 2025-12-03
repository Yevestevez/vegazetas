import mongoose from 'mongoose'
import 'dotenv/config'

import getAuthorUsername from './getAuthorUsername.js'

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        try {
            getAuthorUsername('691b0596dfe2e03c2191f71f')
                .then(result => console.log('username:', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))