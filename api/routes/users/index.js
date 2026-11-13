import { Router } from 'express'

import jsonBodyParser from '../../middlewares/jsonBodyParser.js'
import getUserNameRouter from '../../modules/users/getUserName/getUserNameRoutes.ts'
import registerUserRouter from '../../modules/users/registerUser/registerUserRoutes.ts'
import authenticateUserRouter from '../../modules/users/authenticateUser/authenticateUserRoutes.ts'

import {
    getUserUsernameHandler,
    passwordRecoverHandler,
    passwordResetHandler,
    toggleFavoriteRecipeHandler
} from './handlers/index.js'

const router = new Router()

router.use('/auth', authenticateUserRouter)
router.use(getUserNameRouter)
router.use(registerUserRouter)
router.get('/username', getUserUsernameHandler)

router.post('/password/recover', jsonBodyParser, passwordRecoverHandler)
router.post('/password/reset/:token', jsonBodyParser, passwordResetHandler)

router.patch('/favorites/:recipeId', toggleFavoriteRecipeHandler)

export default router