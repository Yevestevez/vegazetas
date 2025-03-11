import { Router } from 'express'
import { authenticateUserHandler, getUserNameHandler, registerUserHandler } from './handlers/index.js'
import jsonBodyParser from '../../middlewares/jsonBodyParser.js'

const router = new Router()

router.post('/auth', jsonBodyParser, authenticateUserHandler)
router.get('/', getUserNameHandler)
router.post('/', jsonBodyParser, registerUserHandler)

export default router