import type { RequestHandler } from 'express'
import { json } from 'express'

const parseJson = json()

const jsonBodyParser: RequestHandler = (req, res, next) => {
    parseJson(req, res, error => {
        if (error) return next(error)

        if (req.body === undefined) req.body = {}
        next()
    })
}

export default jsonBodyParser
