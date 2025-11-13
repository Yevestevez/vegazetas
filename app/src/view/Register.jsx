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
const { DuplicityError, SystemError } = errors

function Register({ onUserRegistered }) {
    const { alert } = useAppContext()
    const [password, setPassword] = useState('')

    const handleFormSubmit = event => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value.trim()
        const email = form.email.value.trim()
        const username = form.username.value.toLowerCase().trim()
        const password = form.password.value.trim()

        let closeAlert

        const loadingAlertTimeout = setTimeout(() => {
            closeAlert = alert('El servidor está despertando... Solo espera mientras creamos tu cuenta.', {
                isWakingServer: true,
            })
        }, 2000)

        try {
            logic.registerUser(name, email, username, password)
                .then(() => {
                    clearTimeout(loadingAlertTimeout)
                    if (closeAlert) closeAlert()

                    form.reset()

                    onUserRegistered()
                })
                .catch(error => {
                    clearTimeout(loadingAlertTimeout)
                    if (closeAlert) closeAlert()

                    if (error instanceof DuplicityError)
                        alert(error.message)
                    else if (error instanceof SystemError)
                        alert('Sorry, try again later')
                })
        } catch (error) {
            clearTimeout(loadingAlertTimeout)
            if (closeAlert) closeAlert()

            alert(error.message)

            console.error(error)
        }
    }

    const labelClasses = 'anybody text-xl font-bold text-sgbus-green'

    return <div className="flex flex-col items-center justify-start md:justify-center w-full min-h-screen gap-2 xs:gap-4 py-6 xs:py-10 md:pt-0 bg-canary">
        <LogoVegazetas to="/Landing" className="text-violet hover:text-folly"></LogoVegazetas>

        <main className="flex flex-col items-center justify-center w-full max-w-7xl gap-4 xs:gap-8 px-8 xs:px-20 pb-10 xs:pb-20">
            <SectionTitle className="bg-violet text-canary">REGISTRO</SectionTitle>

            <form className="flex flex-col items-center justify-center w-full gap-2"
                onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2 xs:gap-4 md:gap-10">

                    <div className="flex flex-col xs:gap-2 text-center">
                        <label className={labelClasses} htmlFor="name">Nombre</label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nombre"
                            theme="register"
                            name="name"
                            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$"
                            maxLength={50}
                            required
                            title="Solo letras y espacios, hasta 50 caracteres"
                        />
                    </div>

                    <div className="flex flex-col xs:gap-2 text-center">
                        <label className={labelClasses} htmlFor="email">Email</label>
                        <Input
                            type="email"
                            placeholder="Email"
                            theme="register"
                            name="email"
                            id="email"
                            title="Email con el que accederás a Vegazetas"
                            required
                        />
                    </div>

                    <div className="flex flex-col xs:gap-2 text-center">
                        <label className={labelClasses} htmlFor="username">Usuario</label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Usuario"
                            theme="register"
                            name="username"
                            maxLength={25}
                            pattern="^[a-zA-Z0-9._-]{1,25}$"
                            title="Solo minúsculas, números, guiones, guiones bajos o puntos, sin espacios. Máx. 25 caracteres"
                            required
                        />
                    </div>

                    <div className="flex flex-col xs:gap-2 text-center">
                        <label className={labelClasses} htmlFor="password">Contraseña</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            theme="register"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            pattern="^(?!.*[\s])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&-_+]{8,25}$"
                            title="La contraseña debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número y no contener espacios"
                        />
                    </div>
                </div>
                <CircleButton
                    type="submit" variant="large" className={"self-end mt-4 bg-sgbus-green hover:bg-violet text-canary hover:text-hot-magenta z-10"}
                >Registro
                </CircleButton>
            </form>

            <nav aria-label="Navegación a Inicio" className="flex flex-col w-full gap-2 -mt-24 xs:-mt-28 md:-mt-32 lg:-mt-36 text-violet">
                <p className="anybody text-xs xs:text-sm">¿Ya tienes cuenta?</p>
                <Link className="z-0 w-fit anybody-title text-4xl xs:text-5xl md:text-6xl font-bold underline decoration-8 transition-all duration-150 ease-out hover:text-hot-magenta hover:-translate-y-2 hover:scale-105 active:scale-95 focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105"
                    to="/login"
                >Login</Link>
            </nav>
        </main>

        <Footer />
    </div>
}

export default Register