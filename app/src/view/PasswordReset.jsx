import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import logic from '../logic'
import { useAppContext } from '../context'

import LogoVegazetas from './common/LogoVegazetas.jsx'
import Input from './common/Input.jsx'
import CircleButton from './common/CircleButton.jsx'
import Footer from './common/Footer.jsx'
import { errors } from 'com'
const { SystemError, ValidationError } = errors


function PasswordReset({ onPasswordReseted }) {
    const { alert, confirm } = useAppContext()

    const { token } = useParams()
    const [password, setPassword] = useState('')

    if (!token) {
        alert('Enlace inválido para restablecer la contraseña.')
        return null
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        confirm('¿Quieres cambiar tu contraseña?', accepted => {
            if (accepted) {
                const form = event.target
                const newPassword = form.password.value.trim()

                let closeAlert

                const loadingAlertTimeout = setTimeout(() => {
                    closeAlert = alert('El servidor está despertando... Solo espera mientras cambiamos tu contraseña', {
                        isWakingServer: true,
                    })
                }, 2000)

                try {
                    logic.passwordReset(token, newPassword)
                        .then(() => {
                            clearTimeout(loadingAlertTimeout)
                            if (closeAlert) closeAlert()

                            alert('Contraseña cambiada correctamente')

                            onPasswordReseted()
                        })
                        .catch(error => {
                            clearTimeout(loadingAlertTimeout)
                            if (closeAlert) closeAlert()

                            if (error instanceof ValidationError)
                                alert(error.message)
                            else if (error instanceof SystemError)
                                alert('Sorry try again')
                        })
                } catch (error) {
                    clearTimeout(loadingAlertTimeout)
                    if (closeAlert) closeAlert()

                    alert(error.message)
                    console.error(error)
                }
            }
        })
    }

    return <div className="flex flex-col min-h-screen min-w-screen items-center justify-center gap-12 xl:gap-12 bg-folly">
        <header>
            <LogoVegazetas to="/Landing" className="text-spring-bud" />
        </header>

        <main className="flex flex-col items-center justify-center w-full max-w-7xl gap-6 xs:gap-8 px-8 xs:px-20 pb-10 xs:pb-20">
            <h1 className="text-center anybody-title text-spring-bud text-2xl lg:text-4xl xl:text-5xl leading-tight lg:leading-tight xl:leading-tight">Restablecimiento de contraseña</h1>

            <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center w-full gap-4">

                <label htmlFor="password" className="anybody text-xl lg:text-2xl font-bold text-spring-bud">Nueva contraseña</label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    theme="passwordReset"
                    id="password"
                    name="password"
                    pattern="^(?!.*[\s])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&-_+]{8,25}$"
                    title="La contraseña debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número y no contener espacios"
                />

                <CircleButton type="submit" className="bg-spring-bud text-folly hover:outline hover:outline-spring-bud hover:bg-folly hover:text-spring-bud mt-4">Guardar</CircleButton>

            </form>
        </main>

        <Footer />
    </div>
}

export default PasswordReset