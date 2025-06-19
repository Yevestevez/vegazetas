import logic from '../logic'
import PasswordInput from './common/PasswordInput.jsx'
import { useParams } from 'react-router-dom'

import { errors } from 'com'
const { SystemError, ValidationError } = errors;

import { useAppContext } from '../context'
import { useState } from 'react'

function PasswordReset({ onPasswordReseted }) {
    const { alert, confirm } = useAppContext()
    const { token } = useParams()
    const [password, setPassword] = useState('')

    const handleFormSubmit = event => {
        event.preventDefault()

        confirm('¿Quieres cambiar tu contraseña?', accepted => {
            if (accepted) {
                const form = event.target
                const newPassword = form.password.value.trim()

                let closeAlert

                const loadingAlertTimeout = setTimeout(() => {
                    closeAlert = alert('⏳ El servidor se está despertando, espera unos segundos...')
                }, 2000)

                try {
                    logic.passwordReset(token,newPassword)
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

    console.log('PasswordReset -> render')

    return <div className="
        /* Layout */
        flex flex-col min-h-screen min-w-screen items-center gap-[14vw] sm:gap-[10vw] md:gap-[8vw] xl:gap-[4vw] 2xl:gap-[3vw] pb-[4vw]

        /* Colores */
        bg-folly
    ">
        <h1 className="
            /* Layout */
            text-center
            mt-[38vw] sm:mt-[24vw] md:mt-[22vw] xl:mt-[4vw]

            /* Tipografía */
            anybody-logo text-spring-bud
            text-[30vw]/[80%]
            sm:text-[28vw]/[80%]
            md:text-[24vw]/[80%]
            xl:text-[12vw]/[80%]
            2xl:text-[11vw]/[80%]

            /* Sombra */
            drop-shadow-[0.06em_0.06em_0_rgba(0,0,0,0.8)]
        ">Vega<br></br>zetas</h1>

        <h2 className="
        /* Layout */
        flex items-center justify-center text-center xl:-mt-[0.5vw]

        pt-[1vw] sm:pt-[0.5vw]
        h-[10vw] sm:h-[8vw] xl:h-[3vw]
        w-[54vw] sm:w-[50vw] xl:w-[18vw]

        /* Tipografía */
        anybody-title text-[6vw]
        sm:text-[5vw]
        xl:text-[2vw]

        /* Colores */
        bg-spring-bud text-folly

        /* Sombra */
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
        sm:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)]
        md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
        xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
        ">NUEVA CONTRASEÑA</h2>

        <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center w-full gap-[1.5vw] xl:gap-[0.5vw]">
            <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Nueva contraseña"
                pattern="^(?!.*[\s])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&-_+]{8,25}$"
                title="La contraseña debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número y no contener espacios"
                className="w-[60vw] xl:w-[30vw]"
                theme="passwordReset"
            />

            <button
                className="
                        /* Layout */
                        rounded-full anybody-logo
                        mt-[4vw] xl:mt-[1vw] 2xl:mt-[0.5vw]
                        outline-0

                        /* Tamaño */
                        w-[20vw] h-[20vw]
                        sm:w-[18vw] sm:h-[18vw]
                        md:w-[14vw] md:h-[14vw]
                        xl:w-[11vw] xl:h-[11vw]
                        2xl:w-[9vw] 2xl:h-[9vw]

                        /* Tipografía */
                        text-[clamp(min(4vw,10rem),4vw,10rem)]
                        md:text-[clamp(min(2vw,10rem),3vw,10rem)]
                        lg:text-[clamp(min(2vw,10rem),2.8vw,10rem)]
                        xl:text-[clamp(min(2vw,10rem),2vw,12rem)]

                        /* Sombra */
                        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
                        md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                        xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                        hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)]
                        hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)]
                        hover:lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)]
                        hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.7)]

                        /* Colores */
                        bg-spring-bud
                        text-folly

                        /* Interacciones */
                        transition-transform duration-150 ease-out
                        hover:-translate-y-2 hover:scale-105
                        hover:bg-folly hover:text-spring-bud
                        hover:outline-[0.3vw] hover:outline-spring-bud
                    "
            >Guardar</button>
        </form>
    </div>
}

export default PasswordReset