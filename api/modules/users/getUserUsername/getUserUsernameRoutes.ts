import { Router } from 'express'
import { getUserUsername } from './composition.ts'
import { createGetUserUsernameHandler } from './getUserUsernameHandler.ts'

const router = Router()

router.get('/username', createGetUserUsernameHandler(getUserUsername))

export default router
