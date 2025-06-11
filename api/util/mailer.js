import nodemailer from 'nodemailer'
export async function createTestMailTransporter() {
    const testAccount = await nodemailer.createTestAccount()

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
}