import { User } from '../../../data/models.js'
import type { FindUserUsernameById } from './getUserUsername.ts'

export const findUserUsernameById: FindUserUsernameById = userId =>
    User.findById(userId).select('username').exec()
