import type { ErrorRequestHandler } from 'express'
import { errors } from 'com'
const { CredentialsError, DuplicityError, NotFoundError, OwnershipError, SystemError, ValidationError } = errors;

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production'
    
    if (error instanceof ValidationError)
        res.status(400).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof CredentialsError) {
        res.set('WWW-Authenticate', 'Bearer')
        res.status(401).json({ error: error.constructor.name, message: error.message });
    } else if (error instanceof OwnershipError)
        res.status(403).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof NotFoundError)
        res.status(404).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof DuplicityError)
        res.status(409).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof SystemError)
        res.status(500).json({ error: error.constructor.name, message: error.message });
    else {
        if (!isProduction) {
            console.error('Unhandled error:', error)
        }
        const message = isProduction ? 'An internal error occurred' : (error as Error).message
        res.status(500).json({ error: SystemError.name, message })
    }
}

export default errorHandler
