import nodemailer from 'nodemailer'
import { errors, validate } from 'com'

const { NotFoundError, SystemError } = errors

export type RecoveryUser = {
    id: string
    email: string
}

type FindUserByEmail = (email: string) => Promise<RecoveryUser | null>
type RecoveryMail = {
    from: string
    to: string
    subject: string
    html: string
}
type DevelopmentMail = RecoveryMail & { text: string }
type SentMessageInfo = Parameters<typeof nodemailer.getTestMessageUrl>[0]
type CreateTransporter = () => Promise<unknown>
type CreateRecoveryToken = (userId: string) => string

function validateEmail(email: unknown): asserts email is string {
    validate.email(email)
}

function isDevelopmentTransporter(value: unknown): value is {
    sendMail: (mail: DevelopmentMail) => Promise<SentMessageInfo>
} {
    return typeof value === 'object' && value !== null &&
        'sendMail' in value && typeof value.sendMail === 'function'
}

type ResendResponse = { data: { id: string }; error: null } | { data: null; error: { message: string; name: string } }

function isProductionTransporter(value: unknown): value is {
    emails: { send: (mail: RecoveryMail) => Promise<ResendResponse> }
} {
    return typeof value === 'object' && value !== null &&
        'emails' in value && typeof value.emails === 'object' && value.emails !== null &&
        'send' in value.emails && typeof value.emails.send === 'function'
}

const errorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error)

export const createPasswordRecover = (
    findUserByEmail: FindUserByEmail,
    createTransporter: CreateTransporter,
    createRecoveryToken: CreateRecoveryToken
) => (email: unknown): Promise<void> => {
    validateEmail(email)

    return findUserByEmail(email)
        .catch(error => {
            throw new SystemError(errorMessage(error))
        })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            const token = createRecoveryToken(user.id)

            return createTransporter()
                .catch(error => {
                    throw new SystemError(errorMessage(error))
                })
                .then(async (transporter) => {
                    const frontendBase = process.env.FRONTEND_URL!.replace(/\/$/, '')
                    const resetLink = `${frontendBase}/password-reset/${encodeURIComponent(token)}`

                    if (process.env.NODE_ENV === 'development') {
                        if (!isDevelopmentTransporter(transporter)) {
                            throw new SystemError('Development email transporter is unavailable')
                        }

                        const info = await transporter.sendMail({
                            from: `"Vegazetas" <${process.env.MAIL_FROM}>`,
                            to: user.email,
                            subject: 'Recuperar contraseña Vegazetas',
                            text: `Haz click en el siguiente enlace para cambiar tu contraseña: ${resetLink}`,
                            html: `<p>Haz click en el siguiente enlace para cambiar tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
                        })
                        const previewUrl = nodemailer.getTestMessageUrl(info)
                        console.log('📨 Vista previa (Ethereal):', previewUrl)
                        return
                    }

                    if (!isProductionTransporter(transporter)) {
                        throw new SystemError('Production email transporter is unavailable')
                    }

                    const { data, error } = await transporter.emails.send({
                        from: process.env.MAIL_FROM!,
                        to: user.email,
                        subject: 'Recuperar contraseña Vegazetas',
                        html: `<p>Haz click en el siguiente enlace para cambiar tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
                    })

                    if (error) {
                        console.error('❌ Resend error:', error.message)
                        throw new SystemError(`Email send failed: ${error.message}`)
                    }

                    console.log('✅ Email enviado mediante Resend API, id:', data.id)
                })
        })
}
