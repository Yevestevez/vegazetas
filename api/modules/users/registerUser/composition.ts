import bcrypt from 'bcryptjs'
import { userRepo } from '../../../data/repositories/index.ts'
import { createRegisterUser } from './registerUser.ts'

export const registerUser = createRegisterUser(bcrypt.hash, userRepo.createUser)
