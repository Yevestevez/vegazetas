import { Router } from 'express'
import jsonBodyParser from '../../../middlewares/jsonBodyParser.ts'
import { passwordResetLimiter } from '../../../middlewares/rateLimiter.ts'
import { createPasswordResetHandler } from './passwordResetHandler.ts'
import { passwordReset } from './composition.ts'

const router = Router()

router.post('/:token', passwordResetLimiter, jsonBodyParser, createPasswordResetHandler(passwordReset))

export default router
