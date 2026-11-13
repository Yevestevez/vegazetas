import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createPasswordReset } from './passwordReset.ts'
import { findUserById } from './userRepository.ts'

const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET!)

export const passwordReset = createPasswordReset(findUserById, bcrypt.hash, verifyToken)
