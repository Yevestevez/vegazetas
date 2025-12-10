import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { errors } from 'com'

const { SystemError } = errors

export function createTestMailTransporter() {
    return nodemailer.createTestAccount()
        .then(testAccount => {
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: { user: testAccount.user, pass: testAccount.pass }
            })
            console.log('📬 Cuenta de pruebas creada:', testAccount.user)
            return transporter
        })
        .catch(error => { throw new SystemError(error.message) })
}

export function createRealMailTransporter() {
    if (!process.env.RESEND_API_KEY) return Promise.reject(new SystemError('Falta RESEND_API_KEY en env'))
    const resendClient = new Resend(process.env.RESEND_API_KEY)
    return Promise.resolve(resendClient)
}

export function createMailTransporter() {
    if (process.env.NODE_ENV === 'production') {
        return createRealMailTransporter()  // API de Resend
    } else {
        return createTestMailTransporter()  // Ethereal
    }
}