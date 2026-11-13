import { Router } from 'express'

import getUserNameRouter from '../../modules/users/getUserName/getUserNameRoutes.ts'
import registerUserRouter from '../../modules/users/registerUser/registerUserRoutes.ts'
import authenticateUserRouter from '../../modules/users/authenticateUser/authenticateUserRoutes.ts'
import getUserUsernameRouter from '../../modules/users/getUserUsername/getUserUsernameRoutes.ts'
import toggleFavoriteRecipeRouter from '../../modules/users/toggleFavoriteRecipe/toggleFavoriteRecipeRoutes.ts'
import passwordRecoverRouter from '../../modules/users/passwordRecover/passwordRecoverRoutes.ts'
import passwordResetRouter from '../../modules/users/passwordReset/passwordResetRoutes.ts'

const router = new Router()

router.use('/auth', authenticateUserRouter)
router.use(getUserNameRouter)
router.use(registerUserRouter)
router.use(getUserUsernameRouter)

router.use(passwordRecoverRouter)
router.use('/password/reset', passwordResetRouter)

router.use('/favorites', toggleFavoriteRecipeRouter)

export default router