import { useEffect, useState } from 'react'
import logic from '../../../logic'

import { errors } from 'com'
const { NotFoundError, SystemError } = errors

import { useAppContext } from '../../../context'

import { FaRegUserCircle } from "react-icons/fa"

function Header({ onUserLoggedOut, onLogoClicked }) {
    const { alert, confirm } = useAppContext()

    const [name, setName] = useState(null)

    useEffect(() => {
        console.log('Menu -> "componentDidMount" (useEffect)')

        try {
            logic.getUserName()
                .then(name => setName(name))
                .catch(error => {
                    if (error instanceof NotFoundError)
                        alert(error.message)
                    else if (error instanceof SystemError)
                        alert('sorry, try again')
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }, [])

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
        fixed top-0 left-0 right-0
        flex flex-row items-center justify-between
        py-5 px-10 w-full
        z-10

        /* Colores */
        bg-veronica
    ">
        <a href="" onClick={handleLogoLinkClick}>
            <h1 className="  
                /* Layout */
                text-center

                /* Tipografía */
                anybody-logo text-[8vw]/[80%]
                text-sgbus-green

                /* Sombra */
                drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)]
            ">Vega<br></br>zetas</h1>
        </a>

        <div className="
            /* Layout */
            flex flex-row gap-3 items-center align-middle justify-center
        ">
            <button className="
                /* Tipografía */
                anybody text-[2.7vw]/[120%]
                text-sgbus-green
            " type="button" onClick={handleLogoutButtonClick}>Cerrar<br></br>sesión</button>

            <FaRegUserCircle className="
                /* Layout */
                rounded-full mr-[3vw]

                /* Tamaño */
                text-[14vw] sm:text-[12vw]

                /* Colores */
                text-sgbus-green bg-veronica

                /* Sombra */
                drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                sm:drop-shadow-[0.9vw_0.9vw_0_rgba(0,0,0,0.8)]
            " />
        </div>
    </div>
}

export default Header