import { Router } from 'express'
import jsonBodyParser from '../../../middlewares/jsonBodyParser.ts'
import { authLimiter } from '../../../middlewares/rateLimiter.ts'
import { authenticateUser } from './composition.ts'
import { createAuthenticateUserHandler } from './authenticateUserHandler.ts'

const router = Router()

router.post('/', authLimiter, jsonBodyParser, createAuthenticateUserHandler(authenticateUser))

export default router
