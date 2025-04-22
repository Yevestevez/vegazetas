import { User } from '../data/models.js'
import { validate, errors } from 'com'

const { CredentialsError, SystemError } = errors

import bcrypt from 'bcryptjs'

const authenticateUser = (email, password) => {
    validate.email(email)
    validate.password(password)

    return User.findOne({ email }) // busco usuario en db mediante email introducido
        .catch(error => { throw new SystemError(error.message) }) // capturo error en db
        .then(user => {
            if (!user) throw new CredentialsError('wrong credentials') // si no existe el usuario, lanzo error de credenciales

            return bcrypt.compare(password, user.password) // comparo contraseña introducida (password) con contraseña guardada en db (user.password) usando bcrypt
                .catch(error => { throw new SystemError(error.message) }) // capturo posible error
                .then(match => {
                    if (!match) throw new CredentialsError('wrong credentials') // compruebo si las contraseñas concuerdan, si no, lanzo error de credenciales

                    return user._id.toString() // si no hay error, devuelvo el id del usuario (_id en MongoDB), convertido a String
                })
        })
}

export default authenticateUser