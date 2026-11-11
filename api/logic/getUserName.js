import { createGetUserName } from '../modules/users/getUserName/getUserName.ts'
import { findUserById } from '../modules/users/getUserName/userNameRepository.ts'

export default createGetUserName(findUserById)