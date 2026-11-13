import { User } from '../../../data/models.js'

export const createUser = async (
    name: string,
    email: string,
    username: string,
    password: string
): Promise<void> => {
    await User.create({ name, email, username, password })
}
