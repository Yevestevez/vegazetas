import { Router } from 'express'
import jsonBodyParser from '../../../middlewares/jsonBodyParser.js'
import { authenticateUser } from './composition.ts'
import { createAuthenticateUserHandler } from './authenticateUserHandler.ts'

const router = Router()

router.post('/', jsonBodyParser, createAuthenticateUserHandler(authenticateUser))

export default router
