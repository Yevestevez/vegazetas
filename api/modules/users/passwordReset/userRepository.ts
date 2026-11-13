import { User } from '../../../data/models.js'
import type { ResetUser } from './passwordReset.ts'

export const findUserById = (userId: unknown): Promise<ResetUser | null> =>
    User.findById(userId).exec()
