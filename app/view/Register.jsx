import logic from '../logic'

import { errors } from 'com'
const { DuplicityError, SystemError, ValidationError } = errors

import { useAppContext } from '../context'

function Register({ onLoginClicked, onUserRegistered }) {
    const { alert } = useAppContext()

    const handleLoginLinkClick = event => {
        event.preventDefault()

        onLoginClicked()
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value
        const email = form.email.value
        const username = form.username.value
        const password = form.password.value

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
        p-5 mb-[2vw] sm:mb-[3vw]

        /* Tamaño */
        w-[70vw] h-[14vw]
        sm:h-[12vw]

        /* Colores */
        bg-sgbus-green focus:bg-canary
        outline-sgbus-green 
        focus:outline-5 focus:text-sgbus-green

        /* Tipografía */
        anybody text-canary text-center text-[4.5vw]
        sm:text-[3.8vw]
        min-w-0 truncate placeholder:italic

        /* Sombra */
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
    `

    return <div className="
        /* Layout */
        flex flex-col min-h-screen min-w-screen items-center

        /* Colores */
        bg-canary
    ">
        <h1 className="
            /* Layout */
            text-center mt-[18vw]
            sm:mt-[10vw]

            /* Tipografía */
            anybody-logo text-violet
            text-[22vw]/[80%]
            sm:text-[22vw]/[80%]
            md:text-[15vw]/[80%]
            lg:text-[12vw]/[80%]

            /* Sombra */
            drop-shadow-[0.07em_0.07em_0_rgba(0,0,0,0.8)]
        ">Vega<br></br>zetas</h1>

        <h2 className="
            /* Layout */
            flex items-center justify-center text-center
            mt-[10vw] sm:mt-[6vw]
            pt-[1vw] sm:pt-[1vw]
            h-[10vw] sm:h-[8vw]
            w-[30vw] sm:w-[26vw]

            /* Tipografía */
            anybody-title text-[6vw]
            sm:text-[5vw]

            /* Colores */
            bg-violet text-canary

            /* Sombra */
            drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
        ">REGISTRO</h2>

        <main>
            <form className="
                /* Layout */
                flex flex-col items-center justify-center
                gap-[1.5vw]
                mt-[8vw] sm:mt-[6vw]
            "
                onSubmit={handleFormSubmit}>
                <label className="
                    /* Tipografía */
                    anybody font-bold text-[4.5vw]
                    
                    /* Colores */
                    text-sgbus-green
                " htmlFor="name">Nombre</label>
                <input className={inputClasses} type="text" id="name" placeholder="¿Quién eres?" maxLength={50} pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$" title="Solo letras y espacios, hasta 50 caracteres" required />

                <label className="
                    /* Tipografía */
                    anybody font-bold text-[4.5vw]
                    
                    /* Colores */
                    text-sgbus-green
                " htmlFor="email">Email</label>
                <input className={inputClasses} type="email" id="email" placeholder="¿Cuál es tu email?" title="Email con el que accederás a Vegazetas" required />

                <label className="
                    /* Tipografía */
                    anybody font-bold text-[4.5vw]
                    
                    /* Colores */
                    text-sgbus-green
                " htmlFor="username">Usuario</label>
                <input className={inputClasses} type="text" id="username"
                    placeholder="Tu nombre en Vegazetas"
                    maxLength={25}
                    pattern="^[a-z0-9._-]{1,25}$"
                    title="Solo minúsculas, números, guiones, guiones bajos o puntos, sin espacios. Máx. 25 caracteres"
                    required />

                <label className="
                    /* Tipografía */
                    anybody font-bold text-[4.5vw]
                    
                    /* Colores */
                    text-sgbus-green
                " htmlFor="password">Contraseña</label>
                <input className={inputClasses} type="password" id="password" placeholder="Contraseña de acceso" pattern="^(?!.*[\s])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&-_+]{8,25}$" title="La contraseña debe tener entre 8 y 25 caracteres, incluir al menos una letra y un número y no contener espacios" required />

                <button
                    className="
                        /* Layout */
                        flex items-center justify-center self-end rounded-full anybody-logo
                        mt-[6vw]

                        /* Tamaño */
                        w-[20vw] h-[20vw]
                        sm:w-[18vw] sm:h-[18vw]
                        md:w-[14vw] md:h-[14vw]
                        lg:w-[11vw] lg:h-[11vw]
                        xl:w-[10vw] xl:h-[10vw]
                        2xl:w-[8vw] 2xl:h-[8vw]

                        /* Tipografía */
                        text-[clamp(min(3.5vw,10rem),3.5vw,10rem)]
                        md:text-[clamp(min(2vw,10rem),4vw,10rem)]
                        lg:text-[clamp(min(2vw,10rem),3vw,10rem)]
                        xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

                        /* Sombra */
                        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
                        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                        hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
                        hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]

                        /* Colores */
                        bg-sgbus-green hover:bg-canary
                        text-canary hover:text-sgbus-green

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
                flex flex-col w-full
                gap-[2vw]
                -mt-[20vw] sm:-mt-[18vw]
                pb-[15vw]
            ">
                <p className="
                    /* Tipografía */
                    anybody text-[3vw]
                    sm:text-[2.6vw]
                    
                    /* Colores */
                    text-violet
                ">¿Ya tienes cuenta?</p>
                <a className="
                    /* Layout */
                    w-[5rem]

                    /* Tipografía */
                    anybody-title text-[6.5vw]
                    underline decoration-[2.5vw]
                    underline-offset-[2.5vw]

                    /* Colores */
                    text-violet hover:text-hot-magenta

                    /* Interacciones */
                    transition-transform duration-150 ease-out
                    hover:-translate-y-1.5
                "
                    href="" onClick={handleLoginLinkClick} >Login</a>
            </div>
        </main>
    </div>
}

export default Register