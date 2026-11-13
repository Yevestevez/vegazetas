import { Router } from 'express'

import jsonBodyParser from '../../middlewares/jsonBodyParser.js'
import getUserNameRouter from '../../modules/users/getUserName/getUserNameRoutes.ts'
import registerUserRouter from '../../modules/users/registerUser/registerUserRoutes.ts'
import authenticateUserRouter from '../../modules/users/authenticateUser/authenticateUserRoutes.ts'
import getUserUsernameRouter from '../../modules/users/getUserUsername/getUserUsernameRoutes.ts'
import toggleFavoriteRecipeRouter from '../../modules/users/toggleFavoriteRecipe/toggleFavoriteRecipeRoutes.ts'

import {
    passwordRecoverHandler,
    passwordResetHandler
} from './handlers/index.js'

const router = new Router()

router.use('/auth', authenticateUserRouter)
router.use(getUserNameRouter)
router.use(registerUserRouter)
router.use(getUserUsernameRouter)

router.post('/password/recover', jsonBodyParser, passwordRecoverHandler)
router.post('/password/reset/:token', jsonBodyParser, passwordResetHandler)

router.use('/favorites', toggleFavoriteRecipeRouter)

export default router