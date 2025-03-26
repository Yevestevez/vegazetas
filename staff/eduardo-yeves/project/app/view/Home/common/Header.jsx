import { useEffect, useState } from 'react'
import logic from '../../../logic'

import { errors } from 'com'
const { NotFoundError, SystemError } = errors

import { FaRegUserCircle } from "react-icons/fa"

function Header({ onUserLoggedOut, onLogoClicked }) {
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
        try {
            logic.logoutUser()

            onUserLoggedOut()
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    const handleLogoLinkClick = event => {
        event.preventDefault()

        onLogoClicked()
    }

    console.log('Header -> render')

    // Estilos comunes (TailwindCSS)
    const logoClasses = `
    text-[8vw]/[80%]
    anybody-logo text-center
    text-sgbus-green
    drop-shadow-[0.1em_0.1em_0_rgba(0,0,0,0.8)]
`
    return <div className="fixed top-0 flex flex-row items-center justify-between py-5 px-10 w-full bg-veronica z-10">
        <a href="" onClick={handleLogoLinkClick}>
            <h1 className={logoClasses}>Vega<br></br>zetas</h1>
        </a>

        <div className="flex flex-row gap-3 items-center align-middle justify-center">
            <button className="anybody text-sgbus-green text-[2.7vw]/[130%]" type="button" onClick={handleLogoutButtonClick}>Cerrar<br></br>sesión</button>

            <FaRegUserCircle className="text-sgbus-green text-[13vw] drop-shadow-[1.3vw_1.3vw_0_rgba(0,0,0,0.8)] bg-veronica rounded-full" />


        </div>
    </div>
}

export default Header