import { User } from '../../../data/models.js'
import type { FindUserByEmail } from './authenticateUser.ts'

export const findUserByEmail: FindUserByEmail = email => User.findOne({ email }).exec()
