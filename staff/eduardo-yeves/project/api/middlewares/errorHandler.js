import { errors } from 'com'
const { CredentialsError, DuplicityError, NotFoundError, OwnershipError, SystemError, ValidationError } = errors;

export default (error, req, res, next) => {
    if (error instanceof ValidationError)
        res.status(400).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof CredentialsError)
        res.status(401).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof OwnershipError)
        res.status(403).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof NotFoundError)
        res.status(404).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof DuplicityError)
        res.status(409).json({ error: error.constructor.name, message: error.message });
    else if (error instanceof SystemError)
        res.status(500).json({ error: error.constructor.name, message: error.message });
    else
        res.status(500).json({ error: SystemError.name, message: error.message });
}