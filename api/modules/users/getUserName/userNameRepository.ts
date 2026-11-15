import { User } from '../../../data/models.ts'
import type { FindUserById } from './getUserName.ts'

export const findUserById: FindUserById = userId => User.findById(userId).exec()
