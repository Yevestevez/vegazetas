import { Router } from 'express'
import jsonBodyParser from '../../../middlewares/jsonBodyParser.ts'
import { passwordRecover } from './composition.ts'
import { createPasswordRecoverHandler } from './passwordRecoverHandler.ts'

const router = Router()

router.post('/password/recover', jsonBodyParser, createPasswordRecoverHandler(passwordRecover))

export default router
