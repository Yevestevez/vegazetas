import { User } from '../models.ts'
import type { UserFavorites } from 'com/types/repo-types.ts'

export const findUserById = (userId: string) =>
    User.findById(userId).exec()

export const findUserByIdLean = (userId: string) =>
    User.findById(userId).lean().exec()

export const findUserByIdWithFavorites = (userId: string) =>
    User.findById(userId, 'favorites').lean().exec() as Promise<UserFavorites | null>

export const findUserByEmail = (email: string) =>
    User.findOne({ email }).exec()

export const findUserByIdUsername = (userId: string) =>
    User.findById(userId).select('username').exec()

export const createUser = async (name: string, email: string, username: string, password: string) => {
    await User.create({ name, email, username, password })
}

export const updateUserFavorites = (userId: string, favorites: string[]) =>
    User.findByIdAndUpdate(userId, { favorites }, { new: false }).exec()

export const findUserByEmailRecovery = (email: string) =>
    User.findOne({ email }).exec().then(user =>
        user ? { id: user._id.toString(), email: user.email } : null
    )

export const updateUserPassword = (userId: string, password: string) =>
    User.findByIdAndUpdate(userId, { password }, { new: false }).exec()
