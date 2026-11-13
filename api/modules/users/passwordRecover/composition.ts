import jwt from 'jsonwebtoken'
import { createMailTransporter } from '../../../util/mailer.js'
import { createPasswordRecover } from './passwordRecover.ts'
import { findUserByEmail } from './userRepository.ts'

const createRecoveryToken = (userId: string): string =>
    jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '15m' })

export const passwordRecover = createPasswordRecover(findUserByEmail, createMailTransporter, createRecoveryToken)
