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
                process.env.JWT_SECRET, // clave secreta
                { expiresIn: '15m' } // duración del token
            )

            return { user, token }
        })
        .then(({ user, token }) => {
            // Paso 3: crear el transporter de pruebas (Ethereal)
            return createMailTransporter()
                .catch(error => { throw new SystemError(error.message) })
                .then(transporter => {
                    const resetLink = `${process.env.FRONTEND_URL}/password-reset/${token}`

                    // Paso 4: enviar correo con enlace
                    return transporter.sendMail({
                        from: `"Vegazetas" <${process.env.EMAIL_USER}>`,
                        to: user.email,
                        subject: 'Recuperar contraseña Vegazetas',
                        text: `Haz click en el siguiente enlace para cambiar tu contraseña: ${resetLink}`,
                        html: `<p>Haz click en el siguiente enlace para cambiar tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
                    })
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(info => {
            if (process.env.NODE_ENV === 'development') {
                const previewUrl = nodemailer.getTestMessageUrl(info)
                if (previewUrl) {
                    console.log('📨 Vista previa (Ethereal):', previewUrl)
                } else {
                    console.log('📭 No se pudo generar la vista previa del correo.')
                }
            } else if (process.env.NODE_ENV === 'production') {
                console.log('✅ Correo real enviado correctamente.')
            }
        })
}

export default passwordRecover