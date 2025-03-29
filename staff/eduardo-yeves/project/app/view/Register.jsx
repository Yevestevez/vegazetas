import logic from '../logic'

import { errors } from 'com'
const { DuplicityError, SystemError } = errors

function Register({ onLoginClicked, onUserRegistered }) {
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

    // Estilos comunes (TailwindCSS)

    const logoClasses = `
        /* Márgenes */
        mt-[18vw]

        /* Sombra */
        drop-shadow-[0.07em_0.07em_0_rgba(0,0,0,0.8)]

        /* Estilo de texto */
        anybody-logo text-center

        /* Tamaño de texto con responsive */
        text-[22vw]/[80%] 
        sm:text-[20vw]/[80%] 
        md:text-[15vw]/[80%] 
        lg:text-[12vw]/[80%]
    `

    const titleClasses = `
    /* Flexbox */
    flex items-center justify-center

    /* Tamaño y estructura */
    h-[10vw]
    mt-[5vw] 

    /* Fondo y sombra */
    drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]

    /* Estilo de texto */
    anybody-title
    text-[6vw]
`

    const inputClasses = `
        /* Flexbox */
        flex items-center justify-center

        /* Tamaño y estructura */
        w-[70vw] h-[14vw]
        p-5

        /* Fondo, sombra y focus */
        bg-sgbus-green rounded-full outline-sgbus-green 
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8) focus:outline-5 focus:bg-canary focus:text-sgbus-green

        /* Texto */
        anybody text-canary text-center text-[4.5vw]
        min-w-0 truncate placeholder:italic
    `

    const btnClasses = `
    rounded-full 

    /* Tamaño */
    h-[20vw] w-[20vw]
    sm:w-[18vw] sm:h-[18vw]
    md:w-[14vw] md:h-[14vw]
    lg:h-[11vw] lg:w-[11vw]
    xl:h-[10vw] xl:w-[10vw]
    2xl:h-[8vw] 2xl:w-[8vw]

    /* Sombra */
    drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
    lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

    /* Estilo de texto */
    anybody-logo
    text-[clamp(min(3.5vw,10rem),3.5vw,10rem)]
    md:text-[clamp(min(2vw,10rem),4vw,10rem)]
    lg:text-[clamp(min(2vw,10rem),3vw,10rem)]
    xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

    /* Hover y animaciones */
    transition-transform duration-150 ease-out
    hover:bg-folly hover:text-aquamarine
    hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
    hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
    hover:-translate-y-2 hover:scale-105
`

    const linkClasses = `
        anybody-title text-[6.5vw] underline decoration-[3vw]
        transition-transform duration-150 ease-out
        hover:-translate-y-1.5
    `

    return <div className="flex flex-col min-h-screen min-w-screen bg-canary items-center">
        <h1 className={`${logoClasses} text-violet`}>Vega<br></br>zetas</h1>

        <h2 className={`${titleClasses} w-[32vw] bg-violet text-canary`}>Registro</h2>

        <main>
            <form className="flex flex-col gap-[1.5vw] mt-[10vw] items-center justify-center" onSubmit={handleFormSubmit}>
                <label className="text-sgbus-green anybody font-bold text-[4.5vw]" htmlFor="name">Nombre</label>
                <input className={`${inputClasses}`} type="text" id="name" placeholder="Nombre Apellido" />

                <label className="text-sgbus-green anybody font-bold text-[4.5vw]" htmlFor="email">Email</label>
                <input className={`${inputClasses}`} type="email" id="email" placeholder="email@email.com" />

                <label className="text-sgbus-green anybody font-bold text-[4.5vw]" htmlFor="username">Usuario</label>
                <input className={`${inputClasses}`} type="text" id="username" placeholder="NombreDeUsuario123" />

                <label className="text-sgbus-green anybody font-bold text-[4.5vw]" htmlFor="password">Contraseña</label>
                <input className={`${inputClasses}`} type="password" id="password" placeholder="contraseña123" />

                <button className={`${btnClasses}} flex items-center justify-center self-end bg-sgbus-green mt-[6vw] text-canary`} type="submit">Registro</button>
            </form>

            <div className="flex flex-col w-full -mt-[20vw] gap-[2vw]">
                <p className="text-violet anybody">¿No estás registrado?</p>
                <a className={`${linkClasses} text-violet hover:text-hot-magenta w-[5rem]`} href="" onClick={handleLoginLinkClick} >Login</a>
            </div>
        </main>
    </div>
}

export default Register