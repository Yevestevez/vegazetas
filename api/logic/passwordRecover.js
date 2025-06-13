import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { User } from '../data/models.js'
import { createTestMailTransporter } from '../util/mailer.js'
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
                process.env.JWT_SECRET, // clave secreta
                { expiresIn: '15m' } // duración del token
            )

            return { user, token }
        })
        .then(({ user, token }) => {
            // Paso 3: crear el transporter de pruebas (Ethereal)
            return createTestMailTransporter()
                .catch(error => { throw new SystemError(error.message) })
                .then(transporter => {
                    const resetLink = `${process.env.VITE_FRONTEND_URL}/password-reset/${token}`

                    // Paso 4: enviar correo con enlace
                    return transporter.sendMail({
                        from: '"Vegazetas" <no-reply@vegazetas.com>',
                        to: user.email,
                        subject: 'Recuperar contraseña',
                        text: `Haz click aquí para cambiar tu contraseña: ${resetLink}`,
                        html: `<p>Haz clic aquí para cambiar tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`
                    })
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(info => {
            console.log('📨 Vista previa:', nodemailer.getTestMessageUrl(info))
        })
}

export default passwordRecover