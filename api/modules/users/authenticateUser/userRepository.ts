import { User } from '../../../data/models.ts'
import type { FindUserByEmail } from './authenticateUser.ts'

export const findUserByEmail: FindUserByEmail = email => User.findOne({ email }).exec()
