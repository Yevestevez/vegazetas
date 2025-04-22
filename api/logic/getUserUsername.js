import { User } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const getUserUsername = userId => {
    validate.id(userId, 'userId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return user.username
        })
}

export default getUserUsername