import { Router } from 'express'
import jsonBodyParser from '../../../middlewares/jsonBodyParser.ts'
import { createPasswordResetHandler } from './passwordResetHandler.ts'
import { passwordReset } from './composition.ts'

const router = Router()

router.post('/:token', jsonBodyParser, createPasswordResetHandler(passwordReset))

export default router
