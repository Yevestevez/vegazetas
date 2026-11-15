import { createGetUserUsername } from './getUserUsername.ts'
import { findUserUsernameById } from './userRepository.ts'

export const getUserUsername = createGetUserUsername(findUserUsernameById)
