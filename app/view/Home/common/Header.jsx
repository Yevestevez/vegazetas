// import { useEffect, useState } from 'react'
import logic from '../../../logic'

// import { errors } from 'com'
// const { NotFoundError, SystemError } = errors

import { useAppContext } from '../../../context'

import { FaRegUserCircle } from "react-icons/fa"

function Header({ onUserLoggedOut, onLogoClicked }) {
    const { alert, confirm } = useAppContext()

    // const [name, setName] = useState(null)
    //
    // useEffect(() => {
    //     console.log('Menu -> "componentDidMount" (useEffect)')
    //
    //     try {
    //         logic.getUserName()
    //             .then(name => setName(name))
    //             .catch(error => {
    //                 if (error instanceof NotFoundError)
    //                     alert(error.message)
    //                 else if (error instanceof SystemError)
    //                     alert('sorry, try again')
    //             })
    //     } catch (error) {
    //         alert(error.message)
    //
    //         console.error(error)
    //     }
    // }, [])

    const handleLogoutButtonClick = () => {
        confirm('¿Quieres cerrar sesión?', accepted => {
            if (accepted) {
                try {
                    logic.logoutUser()

                    onUserLoggedOut()
                } catch (error) {
                    alert(error.message)

                    console.error(error)
                }
            }
        })
    }

    const handleLogoLinkClick = event => {
        event.preventDefault()

        onLogoClicked()
    }

    console.log('Header -> render')

    return <div className="
        /* Layout */
        fixed top-0 left-0 z-10 xl:gap-[5vw]

        w-full xl:w-[30vw]
        xl:min-h-[60vh] xl:overflow-y-auto

        flex flex-row xl:flex-col items-center justify-between xl:justify-center

        py-[4vw] sm:py-[3vw] xl:py-[0vw]
        px-[8vw] sm:px-[6vw] md:px-[5vw] xl:px-[3vw]

        /* Colores */
        bg-veronica
    ">
        <a href="" onClick={handleLogoLinkClick}>
            <h1 className="  
                /* Layout */
                text-center

                /* Tipografía */
                anybody-logo
                text-[8vw]/[80%] sm:text-[7vw]/[80%] md:text-[6vw]/[80%] xl:text-[8vw]/[80%]
                text-sgbus-green

                /* Sombra */
                drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)]
            ">Vega<br></br>zetas</h1>
        </a>

        <div className="
            /* Layout */
            flex flex-row xl:flex-col gap-[2vw] xl:gap-[1.5vw] items-center align-middle justify-center
        ">
            <button className="
                anybody text-[2.7vw]/[120%] xl:text-[1.5vw]/[120%]
                text-sgbus-green
                order-1 xl:order-2
                cursor-pointer
            " type="button" onClick={handleLogoutButtonClick}>Cerrar<br className="xl:hidden"></br> sesión</button>

            <FaRegUserCircle className="
                /* Layout */
                rounded-full mr-[2vw] sm:mr-[0.5vw] xl:mr-[0.5vw]
                order-2 xl:order-1

                /* Tamaño */
                text-[13vw] sm:text-[11vw] md:text-[10vw] xl:text-[8vw]

                /* Colores */
                text-sgbus-green bg-veronica

                /* Sombra */
                drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                sm:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                md:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
            " />
        </div>
    </div>
}

export default Header