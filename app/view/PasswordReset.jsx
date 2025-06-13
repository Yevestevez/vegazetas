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

                try {
                    logic.passwordReset(token,newPassword)
                        .then(() => {
                            alert('Contraseña cambiada correctamente')

                            onPasswordReseted()
                        })
                        .catch(error => {
                            if (error instanceof ValidationError)
                                alert(error.message)
                            else if (error instanceof SystemError)
                                alert('Sorry try again')
                        })
                } catch (error) {
                    alert(error.message)
                    console.error(error)
                }
            }
        })
    }

    console.log('PasswordReset -> render')

    return <div className="
        /* Layout */
        flex flex-col min-h-screen min-w-screen items-center gap-[14vw] sm:gap-[10vw] md:gap-[8vw] xl:gap-[4vw] 2xl:gap-[3vw]

        /* Colores */
        bg-folly
    ">
        <h1>PasswordReset</h1>

        <form onSubmit={handleFormSubmit} className="">
            <label className="/* Tipografía */
                    anybody font-bold text-[4.5vw] xl:text-[2vw]

                    /* Colores */
                    text-sgbus-green" htmlFor="password">Contraseña</label>
            <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Nueva contraseña"
                pattern="^(?!.*[\s])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&-_+]{8,25}$"
                title="La contraseña debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número y no contener espacios"
                className="w-[70vw] xl:w-[40vw]"
                theme="register"
            />

            <button>Guardar nueva contraseña</button>
        </form>
    </div>
}

export default PasswordReset