import crypto from 'crypto'
import { User } from '../data/models.js'
import { createTestMailTransporter } from '../util/mailer.js'
import nodemailer from 'nodemailer'
import {errors, validate} from 'com'

const { NotFoundError, SystemError } = errors

const recoverPassword = (email) => {
    validate.email(email)

    return User.findOne({ email })
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

        const token = crypto.randomBytes(32).toString('hex')
        const expires = Date.now() + 1000 * 60 * 15 // 15 minutos

        user.resetPasswordToken = token
        user.resetPasswordExpires = expires

        return user.save()
            .catch(error => { throw new SystemError(error.message) })
            .then(() => {
                return { user, token }
            })
        })
        .then(({ user, token}) => {
            return createTestMailTransporter()
                .catch(error => { throw new SystemError(error.message) })
                .then(transporter => {
                    return { transporter, user, token }
                })
    })
        .then(({ transporter, user, token }) => {
            const resetLink = `http://localhost:5173/reset-password/${token}`

            return transporter.sendMail({
                from: '"Vegazetas" <no-reply@vegazetas.com>',
                to: user.email,
                subject: 'Recuperar contraseña',
                text: 'Haz click aquí para cambiar tu contraseña: ${resetLink}',
                html:`<p>Haz clic aquí para cambiar tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`
            })
            .catch(error => { throw new SystemError(error.message) })
        })
        .then(info => {
            console.log('📨 Vista previa:', nodemailer.getTestMessageUrl(info))
        })
        .catch(error => {
            throw new SystemError(error.message)
        })
}

export default recoverPassword