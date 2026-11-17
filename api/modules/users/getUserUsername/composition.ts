import { userRepo } from '../../../data/repositories/index.ts'
import { createGetUserUsername } from './getUserUsername.ts'

export const getUserUsername = createGetUserUsername(userRepo.findUserByIdUsername)
