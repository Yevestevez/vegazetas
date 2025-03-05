import 'dotenv/config'

import express from 'express'
import cors from 'cors'

import logic from './logic/index.js'
import mongoose from 'mongoose'

import jsonBodyParser from './middlewares/jsonBodyParser.js'

const connectToDb = () => mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected'))

const startApi = () => {
    const api = express()

    api.use(cors())

    api.get('/', (req, res) => res.send('Hello, API!'))

    api.post('/users', jsonBodyParser, (req, res) => {
        try {
            const { name, email, username, password } = req.body

            logic.registerUser(name, email, username, password)
                .then(() => res.status(201).send())
                .catch(error => { throw new Error(error) })
        } catch (error) {
            res.status(400).json({ error: error.constructor.name, message: error.message })
        }
    })

    api.listen(process.env.PORT, () => console.log(`API running on ${process.env.PORT}`))
}

connectToDb()
    .then(() =>
        startApi()
    )
    .catch(error => console.error(error))