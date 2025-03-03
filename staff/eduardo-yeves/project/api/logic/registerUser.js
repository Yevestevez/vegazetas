import { User } from '../data/models.js'

// validate
// errors
// bcrypt

const registerUser = (name, email, username, password) => {
    // validate()
    // bcrypt.hash()

    return User.create({ name, email, username, password })
        .catch(error => { throw new Error(error.message) })
        .then(user => { })
}

export default registerUser