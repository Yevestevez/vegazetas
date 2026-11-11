import { json } from 'express'

const parseJson = json()

export default (req, res, next) => {
    parseJson(req, res, error => {
        if (error) return next(error)

        if (req.body === undefined) req.body = {}
        next()
    })
}