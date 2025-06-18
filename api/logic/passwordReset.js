import jwt from 'jsonwebtoken'
import { User } from '../data/models.js'
import { validate, errors } from 'com'
import bcrypt from 'bcryptjs'

const { ValidationError, NotFoundError, SystemError } = errors

const passwordReset = (token, newPassword) => {
    validate.password(newPassword)

    let payload
    try {
        // Decodificar y verificar el token JWT
        payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new ValidationError('Invalid or expired token')
    }

    // Buscar usuario usando el dato incluido en el token (user.id)
    return User.findById(payload.sub)
        .then(user => {
            if (!user) throw new NotFoundError('User not found')

            // Hashear la nueva contraseña
            return bcrypt.hash(newPassword, 10)
                .then(hash => {
                    user.password = hash

                    return user.save()
                })
        })
        .catch(error => {
            // Propagar errores
            if (error.name === 'ValidationError') throw new ValidationError(error.message)
            if (error.name === 'NotFoundError') throw new NotFoundError(error.message)

            throw new SystemError(error.message)
        })
}

export default passwordReset