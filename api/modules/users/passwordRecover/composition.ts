import jwt from 'jsonwebtoken'
import { userRepo } from '../../../data/repositories/index.ts'
import { createMailTransporter } from '../../../util/mailer.ts'
import { createPasswordRecover } from './passwordRecover.ts'

const createRecoveryToken = (userId: string): string =>
    jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '15m' })

export const passwordRecover = createPasswordRecover(userRepo.findUserByEmailRecovery, createMailTransporter, createRecoveryToken)
