import './config/loadEnv.js'

import mongoose from 'mongoose'

import createApp from './app.js'

const connectToDb = () => mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected'))

const startApi = () => {
    const api = createApp()
    api.listen(process.env.PORT, () => console.log(`API running on ${process.env.PORT}`))
}

connectToDb()
    .then(() =>
        startApi()
    )
    .catch(error => console.error(error))