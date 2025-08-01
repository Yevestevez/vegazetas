import logic from '../logic'
import PasswordInput from './common/PasswordInput.jsx'

import { useAppContext } from '../context'
import { useState } from 'react'

import { errors } from 'com'
const { CredentialsError, SystemError } = errors

function Login({ onRegisterClicked, onUserLoggedIn }) {
    const { alert, confirm } = useAppContext()
    const [password, setPassword] = useState('')
    const [showRecoverPasswordForm, setShowRecoverPasswordForm] = useState(false)

    const handleRegisterLinkClick = event => {
        event.preventDefault()

        onRegisterClicked()
    }

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

    const inputClasses = `
        flex items-center justify-center rounded-full p-[4vw] xl:p-[2vw] mb-[2vw]
        w-[70vw] xl:w-[40vw]
        h-[14vw] sm:h-[12vw] lg:h-[10vw] xl:h-[6vw] 2xl:h-[5vw]
        bg-aquamarine focus:bg-violet outline-aquamarine focus:outline-5 focus:text-aquamarine text-violet
        anybody text-center text-[4.5vw] sm:text-[3.8vw] lg:text-[3.5vw] xl:text-[2vw] min-w-0 truncate placeholder:italic
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
    `

    return <div className="flex flex-col xl:flex-row min-h-screen w-full overflow-hidden items-center justify-center bg-violet">
        <div className="flex flex-col items-center align-middle gap-[6vw] mt-[18vw] sm:mt-[10vw] xl:mt-0 w-full xl:w-[40vw] xl:px-4 xl:fixed xl:left-0">
            <h1 className="
                text-center anybody-logo text-hot-magenta
                text-[22vw]/[80%] sm:text-[22vw]/[80%] md:text-[15vw]/[80%] xl:text-[8vw]/[80%]
                drop-shadow-[0.07em_0.07em_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.09em_0.09em_0_rgba(0,0,0,0.8)]
            "
            >Vega<br></br>zetas</h1>

            <h2 className="
                flex items-center justify-center text-center xl:-mt-[0.5vw]
                pt-[1vw] sm:pt-[0.5vw] h-[10vw] sm:h-[8vw] xl:h-[5vw] w-[22vw] sm:w-[20vw] xl:w-[14vw]
                anybody-title text-[6vw] sm:text-[5vw] xl:text-[4vw] bg-hot-magenta text-violet
                drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
            ">INICIO</h2>
        </div>

        <main className="flex flex-col items-center xl:w-[60vw] xl:ml-[40vw] h-full xl:h-screen xl:bg-hot-magenta overflow-y-auto px-4">
            <form className="flex flex-col items-center justify-center w-full xl:w-[40vw] gap-[1vw] xl:gap-[1vw] mt-[10vw] sm:mt-[6vw] xl:mt-[6vw] 2xl:mt-[4vw]"
                onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center justify-center gap-[2vw] lg:gap-[1vw]">
                    <div className="flex flex-col items-center justify-center gap-[1.5vw]">
                        <label className="anybody font-bold text-[4.5vw] xl:text-[3vw] 2xl:text-[2.5vw] text-aquamarine" htmlFor="email">Email</label>
                        <input className={inputClasses} type="text" id="email" placeholder="¿Cuál es tu email?" title="Email con el que te registraste en Vegazetas" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-[1.5vw]">
                        <label className="mt-[3vw] xl:mt-[0vw] anybody font-bold text-[4.5vw] xl:text-[3vw] 2xl:text-[2.5vw] text-aquamarine" htmlFor="password">Contraseña</label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            placeholder="Contraseña de acceso"
                            pattern="^(?!.*[\s])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&-_+]{8,25}$"
                            title="La contraseña debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número y no contener espacios"
                            className="w-[70vw] xl:w-[40vw]"
                            theme="login"
                        />
                    </div>
                </div>

                <button
                    className="
                        flex items-center justify-center self-end rounded-full anybody-logo mt-[6vw] xl:mt-[2vw] 2xl:mt-[2vw]
                        w-[20vw] h-[20vw] sm:w-[18vw] sm:h-[18vw] md:w-[14vw] md:h-[14vw] xl:w-[11vw] xl:h-[11vw] 2xl:w-[9vw] 2xl:h-[9vw]
                        text-[clamp(4vw,4.5vw,10rem)] md:text-[clamp(2vw,4vw,10rem)] lg:text-[clamp(2vw,3.5vw,10rem)] xl:text-[clamp(2vw,2.8vw,10rem)]
                        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                        hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)] hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)] hover:lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)] hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.7)]
                        bg-aquamarine hover:bg-folly text-violet hover:text-aquamarine
                        transition-transform duration-150 ease-out hover:-translate-y-2 hover:scale-105
                    "
                    type="submit"
                >
                    Inicio
                </button>
            </form>

            <div className="flex flex-col w-full xl:w-[40vw] gap-[2vw] -mt-[20vw] sm:-mt-[18vw] md:-mt-[15vw] lg:-mt-[15vw] xl:-mt-[11vw] 2xl:-mt-[9vw] pb-[15vw] lg:pb-[12vw] xl:pb-[8vw]">
                <p className="anybody text-[3vw] sm:text-[2.6vw] xl:text-[1.8vw] 2xl:text-[1.6vw] -mb-[2vw] text-hot-magenta xl:text-violet">¿No estás registrado?</p>
                <a className="
                    w-[8rem] anybody-title text-hot-magenta xl:text-violet hover:text-canary
                    text-[6.5vw] xl:text-[4.5vw] 2xl:text-[4vw]
                    underline decoration-[2.5vw] xl:decoration-[2vw] 2xl:decoration-[1.5vw]
                    underline-offset-[2.5vw] xl:underline-offset-[1.6vw] 2xl:underline-offset-[1.2vw]
                    transition-transform duration-150 ease-out hover:-translate-y-1.5
                "
                    href="#" onClick={handleRegisterLinkClick} >Registro</a>

                {!showRecoverPasswordForm && (
                    <button
                        className="anybody font-light mt-[6vw] xl:mt-[2vw] 2xl:mt-[2vw] text-[3vw] sm:text-[2.6vw] xl:text-[1.8vw] 2xl:text-[1.6vw] text-aquamarine"
                        onClick={() => setShowRecoverPasswordForm(true)}>¿Olvidaste tu contraseña?
                    </button>
                )}

                {showRecoverPasswordForm && (
                    <div className="flex flex-col items-center justify-center mt-[14vw] xl:mt-[4vw] 2xl:mt-[3vw]">
                        <h3 className="
                            flex items-center justify-center text-center bg-hot-magenta xl:bg-violet text-violet xl:text-hot-magenta
                            pt-[1vw] sm:pt-[0.5vw] h-[8vw] sm:h-[8vw] xl:h-[5vw] w-[50vw] xl:w-[30vw]
                            anybody-title text-[4vw] xl:text-[2.5vw]
                            drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                        ">RECUPERA TU CONTRASEÑA
                        </h3>
                        <form className="flex flex-col mt-[8vw] xl:mt-[4vw] 2xl:mt-[3vw] items-center" onSubmit={handleRecoverPasswordButtonClick}>
                            <input  className={`${inputClasses}`} type="email" name="email" placeholder="¿Cuál es tu email?" required />
                            <button className="
                                flex items-center justify-center rounded-full anybody-logo mt-[4vw] xl:mt-[1vw]
                                w-[20vw] sm:w-[18vw] md:w-[14vw] xl:w-[11vw] 2xl:w-[9vw]
                                h-[20vw] sm:h-[18vw] md:h-[14vw] xl:h-[11vw] 2xl:h-[9vw]
                                text-[clamp(3vw,2vw,10rem)] md:text-[clamp(2vw,2vw,10rem)] lg:text-[clamp(2vw,2vw,10rem)] xl:text-[clamp(1.4vw,1.2vw,10rem)]
                                drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                                hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)] hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)] hover:lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)] hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.7)]
                                bg-aquamarine hover:bg-folly text-violet hover:text-aquamarine
                                transition-transform duration-150 ease-out hover:-translate-y-2 hover:scale-105
                            "
                            type="submit">Recuperar contraseña</button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    </div>
}

export default Login