import bcrypt from 'bcryptjs'
import { userRepo } from '../../../data/repositories/index.ts'
import { createAuthenticateUser } from './authenticateUser.ts'

export const authenticateUser = createAuthenticateUser(userRepo.findUserByEmail, bcrypt.compare)
