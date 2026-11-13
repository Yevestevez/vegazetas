import { Router } from 'express'
import jsonBodyParser from '../../../middlewares/jsonBodyParser.js'
import { registerUser } from './composition.ts'
import { createRegisterUserHandler } from './registerUserHandler.ts'

const router = Router()

router.post('/', jsonBodyParser, createRegisterUserHandler(registerUser))

export default router
