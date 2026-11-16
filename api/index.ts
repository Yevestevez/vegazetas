import './config/loadEnv.ts'

import mongoose from 'mongoose'

import createApp from './app.ts'

const mongoUrl = process.env.MONGO_URL
if (!mongoUrl) {
    console.error('Error: MONGO_URL environment variable is required')
    process.exit(1)
}

const connectToDb = () => mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000
})
    .then(() => console.log('DB connected'))

const port = process.env.PORT ?? '3000'

const startApi = () => {
    const api = createApp()
    api.listen(port, error => {
        if (error) throw error
        console.log(`API running on ${port}`)
    })
}

connectToDb()
    .then(() => startApi())
    .catch(error => {
        console.error('Failed to connect to database:', error.message)
        process.exit(1)
    })
