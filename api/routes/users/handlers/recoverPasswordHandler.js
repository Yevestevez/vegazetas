import logic from '../../../logic/index.js'

export default (req, res, next) => {
    try {
        const { email } = req.body

        logic.recoverPassword(email)
            .then(() => {
                res.status(200).json({ message: 'Correo de recuperación enviado' })
            })
            .catch(error => {
                next(error)
            })
    } catch (error) {
        next(error)
    }
}