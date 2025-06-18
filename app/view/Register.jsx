import logic from '../logic'
import PasswordInput from './common/PasswordInput.jsx'

import { errors } from 'com'
const { DuplicityError, SystemError } = errors

import { useAppContext } from '../context'
import { useState } from 'react'

function Register({ onLoginClicked, onUserRegistered }) {
    const { alert } = useAppContext()
    const [password, setPassword] = useState('')

    const handleLoginLinkClick = event => {
        event.preventDefault()

        onLoginClicked()
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value.trim()
        const email = form.email.value.trim()
        const username = form.username.value.toLowerCase().trim()
        const password = form.password.value.trim()

        try {
            logic.registerUser(name, email, username, password)
                .then(() => {
                    form.reset()

                    onUserRegistered()
                })
                .catch(error => {
                    if (error instanceof DuplicityError)
                        alert(error.message)
                    else if (error instanceof SystemError)
                        alert('Sorry, try again later')
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    console.log('Register -> render')

    const inputClasses = `
        /* Layout */
        flex items-center justify-center rounded-full
        p-[4vw] xl:p-[2vw] mb-[2vw]

        /* Tamaño */
        w-[70vw] xl:w-[40vw] h-[14vw] sm:h-[12vw] lg:h-[10vw] xl:h-[4vw]

        /* Colores */
        bg-sgbus-green focus:bg-canary
        outline-sgbus-green 
        focus:outline-5 focus:text-sgbus-green
        text-canary

        /* Tipografía */
        anybody text-center text-[4.5vw] sm:text-[3.8vw] lg:text-[3.5vw] xl:text-[2vw]
        min-w-0 truncate placeholder:italic

        /* Sombra */
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
        md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
        xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
    `

    const labelClasses = `
         /* Tipografía */
                    anybody font-bold text-[4.5vw] xl:text-[2vw]
                    
                    /* Colores */
                    text-sgbus-green
    `

    return <div className="
    flex flex-col xl:flex-row w-full h-screen
    items-center justify-center
    bg-canary
    overflow-hidden
    ">
        <div className="flex flex-col items-center justify-center align-middle gap-[6vw]
    mt-[18vw] sm:mt-[10vw] xl:mt-0
    w-full xl:w-[40vw] xl:px-4
    xl:h-screen xl:fixed xl:left-0
">
            <h1 className="
                /* Layout */
                text-center

                /* Tipografía */
                anybody-logo text-violet
                text-[22vw]/[80%]
                sm:text-[22vw]/[80%]
                md:text-[20vw]/[80%]
                xl:text-[8vw]/[80%]

                /* Sombra */
                drop-shadow-[0.07em_0.07em_0_rgba(0,0,0,0.8)]
                xl:drop-shadow-[0.09em_0.09em_0_rgba(0,0,0,0.8)]
            ">Vega<br></br>zetas</h1>

            <h2 className="
                /* Layout */
                flex items-center justify-center text-center xl:-mt-[0.5vw]

                pt-[1vw] sm:pt-[0.5vw]
                h-[10vw] sm:h-[8vw] xl:h-[4vw]
                w-[30vw] sm:w-[24vw] xl:w-[18vw]

                /* Tipografía */
                anybody-title text-[6vw]
                sm:text-[5vw]
                xl:text-[3.5vw]

                /* Colores */
                bg-violet text-canary

                /* Sombra */
                drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
                sm:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)]
                md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                xl:drop-shadow-[0.7vw_0.7vw_0_rgba(0,0,0,0.8)]
            ">REGISTRO</h2>
        </div>

        <main className="flex flex-col items-center justify-center xl:bg-violet w-[70vw] xl:w-[60vw] xl:h-screen xl:overflow-y-auto xl:ml-[40vw] xl:pt-[8vw]">
            <div className="w-full xl:max-w-[40vw] xl:mx-auto">
            <form className="
               /* Layout */
                flex flex-col items-center justify-center w-full
                gap-[1.5vw] xl:gap-[0.5vw]
                mt-[10vw] sm:mt-[6vw] max-w-full
            "
                onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center justify-center w-full gap-[1.5vw] xl:gap-[0.5vw] px-2">
                    
                    <label className={labelClasses} htmlFor="name">Nombre</label>
                    <input className={inputClasses} type="text" id="name" placeholder="¿Quién eres?" maxLength={50} pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$" title="Solo letras y espacios, hasta 50 caracteres" required />

                    <label className={labelClasses} htmlFor="email">Email</label>
                    <input className={inputClasses} type="email" id="email" placeholder="¿Cuál es tu email?" title="Email con el que accederás a Vegazetas" required />
                
                
                    <label className={labelClasses} htmlFor="username">Usuario</label>
                    <input
                        className={`${inputClasses} lowercase`}
                        type="text"
                        id="username"
                        placeholder="Tu nombre en Vegazetas"
                        maxLength={25}
                        pattern="^[a-zA-Z0-9._-]{1,25}$"
                        title="Solo minúsculas, números, guiones, guiones bajos o puntos, sin espacios. Máx. 25 caracteres"
                        required />

                    <label className={labelClasses} htmlFor="password">Contraseña</label>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        placeholder="Contraseña de acceso"
                        pattern="^(?!.*[\s])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&-_+]{8,25}$"
                        title="La contraseña debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número y no contener espacios"
                        className="w-[70vw] xl:w-[40vw]"
                        theme="register"
                    />
                </div>

                <button
                    className="
                        /* Layout */
                        flex items-center justify-center self-end rounded-full anybody-logo
                        mt-[6vw] xl:mt-[2vw]

                        /* Tamaño */
                        w-[20vw] h-[20vw]
                        sm:w-[18vw] sm:h-[18vw]
                        md:w-[14vw] md:h-[14vw]
                        xl:w-[10vw] xl:h-[10vw]

                        /* Tipografía */
                        text-[clamp(min(3.5vw,10rem),3.5vw,10rem)]
                        md:text-[clamp(min(2vw,8rem),2.6vw,10rem)]
                        lg:text-[clamp(min(2vw,7rem),2.2vw,10rem)]
                        xl:text-[clamp(min(1.8vw,5rem),1.8vw,10rem)]

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
                        bg-sgbus-green hover:bg-violet
                        text-canary hover:text-hot-magenta

                        /* Interacciones */
                        transition-transform duration-150 ease-out
                        hover:-translate-y-2 hover:scale-105
                    "
                    type="submit"
                >
                    Registro
                </button>
            </form>

            <div className="
                    /* Layout */
                flex flex-col w-full xl:w-[40vw]
                gap-[2vw]
                -mt-[20vw] sm:-mt-[18vw] md:-mt-[15vw] lg:-mt-[15vw] xl:-mt-[10vw]
                pb-[15vw] lg:pb-[12vw] xl:pb-[6vw]
            ">
                <p className="
                    /* Tipografía */
                    anybody text-[3vw] sm:text-[2.6vw] lg:text-[2vw] xl:text-[1.8vw]
                    -mb-[2vw]
                    
                    /* Colores */
                    text-violet xl:text-canary
                ">¿Ya tienes cuenta?</p>
                <a className="
              /* Layout */
                    w-[8rem]

                    /* Tipografía */
                    anybody-title text-[6.5vw] xl:text-[4vw]
                    underline decoration-[2.5vw] xl:decoration-[2vw]
                    underline-offset-[2.5vw] xl:underline-offset-[1.6vw]

                    /* Colores */
                    text-violet xl:text-canary hover:text-hot-magenta

                    /* Interacciones */
                    transition-transform duration-150 ease-out
                    hover:-translate-y-1.5
                "
                    href="" onClick={handleLoginLinkClick} >Login</a>
            </div>
            </div>
        </main>
    </div>
}

export default Register