import logic from '../../../logic/index.js'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const { email, password } = req.body

        logic.authenticateUser(email, password)
            .then(userId => {
                const payload = { sub: userId }

                const token = jwt.sign(payload, process.env.JWT_SECRET)

                res.json(token)
            })
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}