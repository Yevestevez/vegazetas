import { Router } from 'express'
import { authenticateUserHandler, getUserNameHandler, registerUserHandler, getUserUsernameHandler } from './handlers/index.js'
import jsonBodyParser from '../../middlewares/jsonBodyParser.js'

const router = new Router()

router.post('/auth', jsonBodyParser, authenticateUserHandler)
router.get('/name', getUserNameHandler)
router.get('/username', getUserUsernameHandler)
router.post('/', jsonBodyParser, registerUserHandler)

export default router