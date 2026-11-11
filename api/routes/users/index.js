import { Router } from 'express'

import jsonBodyParser from '../../middlewares/jsonBodyParser.js'
import getUserNameRouter from '../../modules/users/getUserName/getUserNameRoutes.ts'

import {
    authenticateUserHandler,
    registerUserHandler,
    getUserUsernameHandler,
    passwordRecoverHandler,
    passwordResetHandler,
    toggleFavoriteRecipeHandler
} from './handlers/index.js'

const router = new Router()

router.post('/auth', jsonBodyParser, authenticateUserHandler)
router.use(getUserNameRouter)
router.get('/username', getUserUsernameHandler)
router.post('/', jsonBodyParser, registerUserHandler)

router.post('/password/recover', jsonBodyParser, passwordRecoverHandler)
router.post('/password/reset/:token', jsonBodyParser, passwordResetHandler)

router.patch('/favorites/:recipeId', toggleFavoriteRecipeHandler)

export default router