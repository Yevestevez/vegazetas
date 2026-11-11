import { User } from '../../../data/models.js'
import type { FindUserById } from './getUserName.ts'

export const findUserById: FindUserById = userId => User.findById(userId).exec()
