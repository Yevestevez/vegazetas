import { Router } from 'express'
import { authenticateUserHandler, getUserNameHandler, registerUserHandler, getUserUsernameHandler, recoverPasswordHandler } from './handlers/index.js'
import jsonBodyParser from '../../middlewares/jsonBodyParser.js'
import passwordRecoverHandler from "./handlers/passwordRecoverHandler.js";

const router = new Router()

router.post('/auth', jsonBodyParser, authenticateUserHandler)
router.get('/name', getUserNameHandler)
router.get('/username', getUserUsernameHandler)
router.post('/', jsonBodyParser, registerUserHandler)
router.post('/password/recover', jsonBodyParser, passwordRecoverHandler)

export default router