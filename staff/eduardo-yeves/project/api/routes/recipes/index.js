import { Router } from 'express'
import { createRecipeHandler, getMyRecipesHandler } from './handlers/index.js'

import jsonBodyParser from '../../middlewares/jsonBodyParser.js'

const router = new Router()

router.post('/', jsonBodyParser, createRecipeHandler)
router.get('/', getMyRecipesHandler)

export default router