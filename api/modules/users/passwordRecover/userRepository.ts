import { User } from '../../../data/models.js'
import type { RecoveryUser } from './passwordRecover.ts'

export const findUserByEmail = (email: string): Promise<RecoveryUser | null> =>
    User.findOne({ email }).exec().then(user =>
        user ? { id: user._id.toString(), email: user.email } : null
    )
