import express from 'express'
import cors from 'cors'
import { usersRouter, recipesRouter } from './routes/index.ts'
import errorHandler from './middlewares/errorHandler.ts'

const createApp = () => {
    const app = express()

    const frontendUrl = process.env.FRONTEND_URL
    if (frontendUrl) {
        app.use(cors({ origin: frontendUrl }))
    } else {
        app.use(cors())
    }
    app.get('/health', (req, res) => res.status(200).send('ok'))
    app.get('/', (req, res) => res.send('Hello, API!'))
    app.use('/users', usersRouter)
    app.use('/recipes', recipesRouter)
    app.use(errorHandler)

    return app
}

export default createApp
