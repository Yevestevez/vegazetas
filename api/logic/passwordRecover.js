import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { User } from '../data/models.js'
import { createMailTransporter } from '../util/mailer.js'
import nodemailer from 'nodemailer'
import { errors, validate } from 'com'

const { NotFoundError, SystemError } = errors

const passwordRecover = (email) => {
    validate.email(email)

    // Paso 1: buscar al usuario por email
    return User.findOne({ email })
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            // Paso 2: generar token JWT con userId y expiración de 15 minutos
            const token = jwt.sign(
                { sub: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            )

            return { user, token }
        })
        .then(({ user, token }) => {
            // Paso 3: crear transporter según entorno
            return createMailTransporter()
                .catch(error => { throw new SystemError(error.message) })
                .then(async transporter => {

                    const frontendBase = process.env.FRONTEND_URL.replace(/\/$/, '')
                    const resetLink = `${frontendBase}/password-reset?token=${encodeURIComponent(token)}`

                    if (process.env.NODE_ENV === 'development') {
                        // En desarrollo usamos Ethereal
                        return transporter.sendMail({
                            from: `"Vegazetas" <${process.env.MAIL_FROM}>`,
                            to: user.email,
                            subject: 'Recuperar contraseña Vegazetas',
                            text: `Haz click en el siguiente enlace para cambiar tu contraseña: ${resetLink}`,
                            html: `<p>Haz click en el siguiente enlace para cambiar tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
                        }).then(info => {
                            const previewUrl = nodemailer.getTestMessageUrl(info)
                            console.log('📨 Vista previa (Ethereal):', previewUrl)
                        })
                    } else {
                        // En producción usamos Resend API
                        return transporter.emails.send({
                            from: process.env.MAIL_FROM,
                            to: user.email,
                            subject: 'Recuperar contraseña Vegazetas',
                            html: `<p>Haz click en el siguiente enlace para cambiar tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
                        }).then(() => console.log('✅ Email enviado mediante Resend API'))
                    }
                })
        })
}

export default passwordRecover