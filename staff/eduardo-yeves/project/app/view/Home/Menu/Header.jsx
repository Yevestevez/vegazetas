import { useEffect, useState } from 'react'
import logic from '../../../logic'

import { FaRegUserCircle } from "react-icons/fa"

function Header({ onUserLoggedOut }) {
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

    console.log('Header -> render')

    // Estilos comunes (TailwindCSS)
    const logoClasses = `
    text-[13vw] 
    anybody-logo text-center
    text-aquamarine
    drop-shadow-[0.1em_0.1em_0_rgba(0,0,0,0.8)]
`
    return <>
        <div className="flex flex-col items-center py-6 w-full gap-2 bg-folly ">
            <h1 className={logoClasses}>Vegazetas</h1>

            <div className="flex flex-row gap-6 items-center">
                <FaRegUserCircle className="text-aquamarine text-[17vw] drop-shadow-[1.3vw_1.3vw_0_rgba(0,0,0,0.8)] bg-folly rounded-full" />

                <div className="flex flex-col items-start">
                    <h2 className="anybody-title text-aquamarine text-[5.5vw] -mb-1 drop-shadow-[0.7vw_0.7vw_0_rgba(0,0,0,0.8)]">{name}</h2>
                    <p className="anybody text-aquamarine text-[3.5vw] font-semibold">¿Qué vas a comer hoy?</p>
                    <button className="anybody text-aquamarine text-[2.7vw] mt-2" type="button" onClick={handleLogoutButtonClick}>Cerrar sesión</button>
                </div>
            </div>
        </div>
    </>
}

export default Header