import { Router } from 'express'
import { createRecipeHandler } from './handlers/index.js'
import jsonBodyParser from '../../middlewares/jsonBodyParser.js'

const router = new Router()

router.post('/', jsonBodyParser, createRecipeHandler)

export default router