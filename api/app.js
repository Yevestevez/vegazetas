import express from 'express'
import cors from 'cors'
import { usersRouter, recipesRouter } from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js'

const createApp = () => {
    const app = express()

    app.use(cors())
    app.get('/health', (req, res) => res.status(200).send('ok'))
    app.get('/', (req, res) => res.send('Hello, API!'))
    app.use('/users', usersRouter)
    app.use('/recipes', recipesRouter)
    app.use(errorHandler)

    return app
}

export default createApp
