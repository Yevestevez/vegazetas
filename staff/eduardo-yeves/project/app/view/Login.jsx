import logic from '../logic'

import { errors } from 'com'
const { CredentialsError, SystemError } = errors

function Login({ onRegisterClicked, onUserLoggedIn }) {
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

    return <div className="flex flex-col min-h-screen min-w-screen bg-violet items-center">
        <h1 className="
        mt-[18vw]
        drop-shadow-[0.07em_0.07em_0_rgba(0,0,0,0.8)]

        text-hot-magenta anybody-logo
        text-[22vw]/[80%] sm:text-[20vw]/[80%] md:text-[15vw]/[80%] lg:text-[12vw]/[80%]
        text-center
        " >Vega<br></br>zetas</h1>

        <h2 className="
        flex  bg-hot-magenta
        items-center justify-center
        h-[10vw] w-[25vw] mt-[5vw] drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
        
        text-violet anybody-title 
        text-[6vw]
        ">Inicio</h2>

        <main>
            <form className="flex flex-col gap-[1.5vw] mt-[10vw] items-center justify-center" onSubmit={handleFormSubmit}>
                <label className="text-aquamarine anybody font-bold text-[4.5vw] " htmlFor="email">Email</label>
                <input className="flex items-center justify-center w-[70vw] h-[14vw] bg-aquamarine rounded-full drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] anybody text-violet text-center text-[4.5vw] min-w-0 truncate p-5" type="text" id="email" placeholder="email@email.com" />

                <label className="text-aquamarine anybody font-bold text-[4.5vw] mt-[3vw]" htmlFor="password">Contraseña</label>
                <input className="flex items-center justify-center w-[70vw] h-[14vw] bg-aquamarine rounded-full drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] anybody text-violet text-center text-[4.5vw] min-w-0 truncate p-5" type="password" id="password" placeholder="contraseña123" />

                <button className="
            flex
            bg-aquamarine rounded-full items-center justify-center self-end mt-[6vw]
            h-[20vw] w-[20vw] sm:w-[18vw] sm:h-[18vw] md:w-[14vw] md:h-[14vw] lg:h-[11vw] lg:w-[11vw] xl:h-[10vw] xl:w-[10vw] 2xl:h-[8vw] 2xl:w-[8vw]
            drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

            text-violet anybody-logo
            text-[clamp(min(4vw,10rem),4.5vw,10rem)] md:text-[clamp(min(2vw,10rem),4vw,10rem)] lg:text-[clamp(min(2vw,10rem),3vw,10rem)] xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

            transition-transform duration-150 ease-out
            hover:bg-violet hover:text-hot-magenta
            hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)] hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
            hover:-translate-y-2 hover:scale-105
            " type="submit">Inicio</button>
            </form>

            <div className="flex flex-col w-full -mt-[20vw] gap-[2vw]">
                <p className="text-hot-magenta anybody">¿No estás registrado?</p>
                <a className="text-hot-magenta anybody-title text-[6.5vw] underline decoration-[3vw]" href="" onClick={handleRegisterLinkClick} >Registro</a>
            </div>
        </main>

    </div>
}

export default Login