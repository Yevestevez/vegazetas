import { useState } from 'react'
import { Link } from "react-router-dom"

import logic from '../logic'
import { useAppContext } from '../context'

import CircleButton from './common/CircleButton.jsx'
import Input from './common/Input.jsx'
import LogoVegazetas from './common/LogoVegazetas.jsx'
import SectionTitle from './common/SectionTitle.jsx'
import Footer from './common/Footer.jsx'
import { errors } from 'com'
const { CredentialsError, SystemError } = errors

function Login({ onUserLoggedIn }) {
    const { alert, confirm } = useAppContext()
    const [password, setPassword] = useState('')
    const [showRecoverPasswordForm, setShowRecoverPasswordForm] = useState(false)

    const handleFormSubmit = event => {
        event.preventDefault()

        const form = event.target
        const email = form.email.value.trim()
        const password = form.password.value.trim()

        let closeAlert

        const loadingAlertTimeout = setTimeout(() => {
            closeAlert = alert('El servidor está despertando... Solo espera y te llevamos a inicio.', {
                isWakingServer: true,
            })
        }, 2000)

        try {
            logic.loginUser(email, password)
                .then(() => {
                    clearTimeout(loadingAlertTimeout)
                    if (closeAlert) closeAlert()

                    form.reset()

                    onUserLoggedIn()
                })
                .catch(error => {
                    clearTimeout(loadingAlertTimeout)
                    if (closeAlert) closeAlert()

                    if (error instanceof CredentialsError)
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

    const handleRecoverPasswordButtonClick = event => {
        event.preventDefault()

        confirm('¿Quieres cambiar la contraseña?', accepted => {
            if (accepted) {
                const form = event.target
                const email = form.email.value.trim()

                let closeAlert

                const loadingAlertTimeout = setTimeout(() => {
                    closeAlert = alert('El servidor está despertando... Solo espera y te enviamos un correo con instrucciones.', {
                        isWakingServer: true,
                    })
                }, 2000)

                try {
                    logic.passwordRecover(email)
                        .then(() => {
                            clearTimeout(loadingAlertTimeout)
                            if (closeAlert) closeAlert()

                            alert('Te hemos enviado un correo para recuperar tu contraseña')
                        })
                        .catch(error => {
                            clearTimeout(loadingAlertTimeout)
                            if (closeAlert) closeAlert()

                            alert(error.message)
                            console.error(error)
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

    const labelClasses = 'anybody text-xl font-bold text-aquamarine'

    return <div className="flex flex-col items-center justify-start md:justify-center w-full min-h-screen gap-2 xs:gap-4 py-6 xs:py-10 md:pt-0 bg-violet">
        <LogoVegazetas to="/Landing" className="text-hot-magenta hover:text-folly"></LogoVegazetas>

        <main className="flex flex-col items-center justify-center w-full max-w-7xl gap-4 xs:gap-8 px-8 xs:px-20 pb-10 xs:pb-20">
            <SectionTitle className="bg-hot-magenta text-violet">INICIO</SectionTitle>

            <form className="flex flex-col items-center justify-center w-full gap-2"
                onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2 xs:gap-4 md:gap-10">

                    <div className="flex flex-col gap-2 text-center">
                        <label className={labelClasses} htmlFor="email">Email</label>
                        <Input
                            type="email"
                            placeholder="Email"
                            theme="login"
                            name="email"
                            id="email"
                            title="Email con el que te registraste en Vegazetas"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 text-center">
                        <label className={labelClasses} htmlFor="password">Contraseña</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            theme="login"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            pattern="^\S{8,25}$"
                            title="Debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número, y no contener espacios."
                        />
                    </div>
                </div>

                <CircleButton
                    type="submit" variant="large" className={"self-end mt-4 bg-aquamarine hover:bg-folly text-violet hover:text-aquamarine z-10"}
                >Inicio
                </CircleButton>
            </form>

            <nav aria-label="Navegación a Registro" className="flex flex-col w-full gap-2 -mt-24 xs:-mt-28 md:-mt-32 lg:-mt-36 text-hot-magenta">
                <p className="anybody text-xs xs:text-sm">¿No estás registrado?</p>
                <Link className="z-0 w-fit anybody-title text-3xl xs:text-5xl md:text-6xl font-bold underline decoration-8 transition-all duration-150 ease-out hover:text-canary hover:-translate-y-2 hover:scale-105 active:scale-95 focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105"
                    to="/register"
                >Registro</Link>
            </nav>

            {!showRecoverPasswordForm && (
                <button
                    className="anybody text-aquamarine cursor-pointer hover:text-hot-magenta hover:scale-105 active:scale-95 focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105 mt-6"
                    onClick={() => setShowRecoverPasswordForm(true)}>¿Olvidaste tu contraseña?
                </button>
            )}

            {showRecoverPasswordForm && (
                <section aria-labelledby="recovery-title" className="w-full flex flex-col items-center justify-center pb-10 xs:pb-20 gap-4 xs:gap-6">
                    <div className="border-t border-aquamarine w-full my-8 border-2" aria-hidden="true" />
                    <h2 id="recovery-title" className="
                            text-center bg-hot-magenta text-violet
                            flex items-center justify-center p-2 anybody-title text-base xs:text-xl drop-shadow-[0.6rem_0.6rem_0_rgba(0,0,0,0.8)]
                        ">RECUPERA TU CONTRASEÑA
                    </h2>
                    <form className="flex flex-col items-center w-full gap-2" onSubmit={handleRecoverPasswordButtonClick}>

                        <label className={labelClasses} htmlFor="email">Email</label>
                        <Input
                            type="email"
                            placeholder="Email"
                            theme="login"
                            name="email"
                            id="email"
                            title="Email con el que accederás a Vegazetas"
                            required
                        />

                        <CircleButton
                            type="submit" variant="large" className={"mt-4 bg-aquamarine hover:bg-folly text-violet hover:text-aquamarine z-10 text-xs xs:text-sm lg:text-xl"}
                        >Recuperar contraseña
                        </CircleButton>
                    </form>
                </section>
            )}
        </main>

        <Footer />
    </div>
}

export default Login