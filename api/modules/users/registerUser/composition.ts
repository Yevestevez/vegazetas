import bcrypt from 'bcryptjs'
import { createRegisterUser } from './registerUser.ts'
import { createUser } from './userRepository.ts'

export const registerUser = createRegisterUser(bcrypt.hash, createUser)
