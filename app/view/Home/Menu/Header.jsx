import { useEffect, useState } from 'react'
import logic from '../../../logic'

import { errors } from 'com'
const { NotFoundError, SystemError } = errors

import { useAppContext } from '../../../context'

import { FaRegUserCircle } from "react-icons/fa"

function Header({ onUserLoggedOut }) {
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

    console.log('Header -> render')

    return <>
        <div className="
            /* Layout */
            flex flex-col sm:flex-row items-center sm:items-center
            sm:justify-center 
            gap-2 sm:gap-12
            py-[3vw] w-full 
            sm:px-12

            /* Colores */
            bg-folly
        ">
            <div className="
                /* Layout */
                sm:w-[30vw]
            ">
                <h1 className="
                    /* Layout */
                    text-center
                    sm:text-center

                    /* Tipografía */
                    anybody-logo text-[13vw]
                    sm:text-[10vw]/[80%]
                    text-aquamarine

                    /* Sombra */
                    drop-shadow-[0.1em_0.1em_0_rgba(0,0,0,0.8)]
                ">Vega<br className="hidden sm:block" />zetas</h1>
            </div>

            <div className="
                /* Layout */
                flex flex-row gap-6 items-center mb-[2vw] sm:mb-0
            ">
                <FaRegUserCircle className="
                    /* Layout */
                    rounded-full

                    /* Tamaño */
                    text-[17vw] sm:text-[14vw]

                    /* Colores */
                    text-aquamarine bg-folly

                    /* Sombra */
                    drop-shadow-[1.3vw_1.3vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                " />

                <div className="
                    /* Layout */
                    flex flex-col items-start
                ">
                    <h2 className="
                        /* Tipografía */
                        anybody-title text-[5.5vw]
                        text-aquamarine

                        /* Layout */
                        -mb-1

                        /* Sombra */
                        drop-shadow-[0.7vw_0.7vw_0_rgba(0,0,0,0.8)]
                    ">{name}</h2>
                    <p className="
                        /* Tipografía */
                        anybody text-[3.5vw] sm:text-[2.5vw] font-semibold
                        text-aquamarine
                    ">¿Qué vas a comer hoy?</p>
                    <button className="
                        /* Tipografía */
                        anybody text-[2.7vw] sm:text-[2vw]
                        text-aquamarine

                        /* Layout */
                        mt-2
                    " type="button" onClick={handleLogoutButtonClick}>Cerrar sesión</button>
                </div>
            </div>
        </div>
    </>
}

export default Header