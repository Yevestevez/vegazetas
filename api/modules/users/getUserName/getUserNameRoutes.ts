import { Router } from 'express'
import { getUserName } from './composition.ts'
import { createGetUserNameHandler } from './getUserNameHandler.ts'

const router = Router()

router.get('/name', createGetUserNameHandler(getUserName))

export default router
