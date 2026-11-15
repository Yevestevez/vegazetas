import bcrypt from 'bcryptjs'
import { createAuthenticateUser } from './authenticateUser.ts'
import { findUserByEmail } from './userRepository.ts'

export const authenticateUser = createAuthenticateUser(findUserByEmail, bcrypt.compare)
