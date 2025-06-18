import nodemailer from 'nodemailer'
import { errors } from 'com'

const { SystemError } = errors

export function createTestMailTransporter() {
    try {
        return nodemailer.createTestAccount()
            .then(testAccount => {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass
                    }
                })

                console.log('📬 Cuenta de pruebas creada:')
                console.log('🔐 Usuario:', testAccount.user)
                console.log('🔐 Contraseña:', testAccount.pass)

                return transporter
            })
            .catch(error => {
                throw new SystemError(error.message)
            })
    } catch (error) {
        throw new SystemError(error.message)
    }
}

export function createRealMailTransporter() {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        return Promise.resolve(transporter)
    } catch (error) {
        return Promise.reject(new SystemError(error.message))
    }
}

export function createMailTransporter() {
    if (process.env.NODE_ENV === 'production') {
        return createRealMailTransporter()
    } else {
        return createTestMailTransporter()
    }
}