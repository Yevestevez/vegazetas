import type { RequestHandler } from 'express'

type RegisterUser = (name: unknown, email: unknown, username: unknown, password: unknown) => Promise<void>

export const createRegisterUserHandler = (registerUser: RegisterUser): RequestHandler => async (req, res, next) => {
    try {
        const { name, email, username, password } = req.body
        await registerUser(name, email, username, password)
        res.status(201).send()
    } catch (error) {
        next(error)
    }
}
