import logic from '../logic'

import { errors } from 'com'
const { CredentialsError, SystemError } = errors

import { useAppContext } from '../context'

function Login({ onRegisterClicked, onUserLoggedIn }) {
    const { alert } = useAppContext()

    const handleRegisterLinkClick = event => {
        event.preventDefault()

        onRegisterClicked()
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        const form = event.target

        const email = form.email.value
        const password = form.password.value

        try {
            logic.loginUser(email, password)
                .then(() => {
                    form.reset()

                    onUserLoggedIn()
                })
                .catch(error => {
                    if (error instanceof CredentialsError)
                        alert(error.message)
                    else if (error instanceof SystemError)
                        alert('Sorry try again')
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    console.log('Login -> render')

    const inputClasses = `
        /* Layout */
        flex items-center justify-center rounded-full
        p-[4vw] mb-[2vw]

        /* Tamaño */
        w-[70vw] h-[14vw] sm:h-[12vw] lg:h-[10vw]

        /* Colores */
        bg-aquamarine focus:bg-violet
        outline-aquamarine 
        focus:outline-5 focus:text-aquamarine

        /* Tipografía */
        anybody text-violet text-center text-[4.5vw] sm:text-[3.8vw] lg:text-[3.5vw]
        min-w-0 truncate placeholder:italic

        /* Sombra */
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
        md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
    `

    return <div className="
        /* Layout */
        flex flex-col min-h-screen min-w-screen items-center

        /* Colores */
        bg-violet
    ">
        <h1 className="
            /* Layout */
            text-center mt-[18vw]
            sm:mt-[10vw]

            /* Tipografía */
            anybody-logo text-hot-magenta
            text-[22vw]/[80%]
            sm:text-[22vw]/[80%]
            md:text-[15vw]/[80%]

            /* Sombra */
            drop-shadow-[0.07em_0.07em_0_rgba(0,0,0,0.8)]
        "
        >Vega<br></br>zetas</h1>

        <h2 className="
            /* Layout */
            flex items-center justify-center text-center
            mt-[10vw] sm:mt-[6vw]
            pt-[1vw] sm:pt-[1vw]
            h-[10vw] sm:h-[8vw]
            w-[22vw] sm:w-[20vw]

            /* Tipografía */
            anybody-title text-[6vw]
            sm:text-[5vw]

            /* Colores */
            bg-hot-magenta text-violet

            /* Sombra */
            drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
            sm:drop-shadow-[1.4w_1.4vw_0_rgba(0,0,0,0.8)]
            md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
        ">INICIO</h2>

        <main>
            <form className="
                /* Layout */
                flex flex-col items-center justify-center
                gap-[1.5vw]
                mt-[10vw] sm:mt-[6vw]
            "
                onSubmit={handleFormSubmit}>
                <label className="
                    /* Tipografía */
                    anybody font-bold text-[4.5vw]
                    
                    /* Colores */
                    text-aquamarine
                " htmlFor="email">Email</label>
                <input className={inputClasses} type="text" id="email" placeholder="¿Cuál es tu email?" title="Email con el que te registraste en Vegazetas" />

                <label className="
                    /* Layout */
                    mt-[3vw]

                    /* Tipografía */
                    anybody font-bold text-[4.5vw]
                    
                    /* Colores */
                    text-aquamarine
                " htmlFor="password">Contraseña</label>
                <input className={inputClasses} type="password" id="password" placeholder="Contraseña de acceso" title="Contraseña con la que te registraste en Vegazetas" />

                <button
                    className="
                        /* Layout */
                        flex items-center justify-center self-end rounded-full anybody-logo
                        mt-[6vw]

                        /* Tamaño */
                        w-[20vw] h-[20vw]
                        sm:w-[18vw] sm:h-[18vw]
                        md:w-[14vw] md:h-[14vw]

                        /* Tipografía */
                        text-[clamp(min(4vw,10rem),4.5vw,10rem)]
                        md:text-[clamp(min(2vw,10rem),4vw,10rem)]
                        lg:text-[clamp(min(2vw,10rem),3.5vw,10rem)]

                        /* Sombra */
                        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
                        md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                        hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)]
                        hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)]
                        hover:lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)]

                        /* Colores */
                        bg-aquamarine hover:bg-folly
                        text-violet hover:text-aquamarine

                        /* Interacciones */
                        transition-transform duration-150 ease-out
                        hover:-translate-y-2 hover:scale-105
                    "
                    type="submit"
                >
                    Inicio
                </button>
            </form>

            <div className="
                /* Layout */
                flex flex-col w-full
                gap-[2vw]
                -mt-[20vw] sm:-mt-[18vw] md:-mt-[15vw] lg:-mt-[15vw]
                pb-[15vw] lg:pb-[12vw]
            ">
                <p className="
                    /* Tipografía */
                    anybody text-[3vw]
                    sm:text-[2.6vw]
                    -mb-[2vw]
                    
                    /* Colores */
                    text-hot-magenta
                ">¿No estás registrado?</p>
                <a className="
                    /* Layout */
                    w-[8rem]

                    /* Tipografía */
                    anybody-title text-[6.5vw]
                    underline decoration-[2.5vw]
                    underline-offset-[2.5vw]

                    /* Colores */
                    text-hot-magenta hover:text-canary

                    /* Interacciones */
                    transition-transform duration-150 ease-out
                    hover:-translate-y-1.5
                "
                    href="" onClick={handleRegisterLinkClick} >Registro</a>
            </div>
        </main>
    </div>
}

export default Login