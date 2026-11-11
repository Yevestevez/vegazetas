import { createGetUserName } from './getUserName.ts'
import { findUserById } from './userNameRepository.ts'

export const getUserName = createGetUserName(findUserById)
