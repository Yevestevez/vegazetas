import logic from '../../../logic/index.js'

export default (req, res, next) => {
    try {
        const { name, email, username, password } = req.body

        logic.registerUser(name, email, username, password)
            .then(() => res.status(201).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}