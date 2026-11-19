import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userRepo } from '../../../data/repositories/index.ts'
import { createPasswordReset } from './passwordReset.ts'

const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] })

export const passwordReset = createPasswordReset(userRepo.findUserById, bcrypt.hash, verifyToken)
