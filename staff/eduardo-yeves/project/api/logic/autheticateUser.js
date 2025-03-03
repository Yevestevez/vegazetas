import { User } from '../data/models.js'

// importar validate y errores personalizados (com) y declarar los necesarios para la lógica (SystemError, CredentialError)
// importar bcrypt

const authenticateUser = (username, password) => {
    // validate
    return User.findOne({ username })
        .catch(error => { throw new Error(error.message) })
        .then(user => {
            if (!user) throw new Error('wrong credentials')

            return
        })
}