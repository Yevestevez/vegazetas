import logic from '../../../logic/index.js'

export default (req, res, next) => {
    try {
        const { token } = req.params
        const { newPassword } = req.body

        logic.passwordReset(token, newPassword)
            .then(() => res.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}