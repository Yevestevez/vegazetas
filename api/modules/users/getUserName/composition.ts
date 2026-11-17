import { userRepo } from '../../../data/repositories/index.ts'
import { createGetUserName } from './getUserName.ts'

export const getUserName = createGetUserName(userRepo.findUserById)
