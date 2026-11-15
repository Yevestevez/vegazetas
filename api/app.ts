import express from 'express'
import cors from 'cors'
import { usersRouter, recipesRouter } from './routes/index.ts'
import errorHandler from './middlewares/errorHandler.ts'
import { securityHeaders } from './middlewares/securityHeaders.ts'

const createApp = () => {
    const app = express()

    app.use(securityHeaders)
    app.use(express.json({ limit: '10kb' }))
    
    const frontendUrl = process.env.FRONTEND_URL
    if (!frontendUrl) {
        throw new Error('FRONTEND_URL environment variable must be defined for security')
    }

    try {
        const url = new URL(frontendUrl)
        app.use(cors({ 
            origin: url.origin,
            credentials: true,
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            maxAge: 3600
        }))
    } catch (error) {
        throw new Error(`FRONTEND_URL must be a valid URL: ${error}`)
    }

    app.get('/health', (req, res) => res.status(200).send('ok'))
    app.get('/', (req, res) => res.send('Hello, API!'))
    app.use('/users', usersRouter)
    app.use('/recipes', recipesRouter)
    app.use(errorHandler)

    return app
}

export default createApp
