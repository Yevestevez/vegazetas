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
            flex flex-col sm:flex-row items-center
            sm:justify-between
            gap-[2vw]
            py-[3vw] md:py-[2vw] w-full sm:px-[10vw]


            /* Colores */
            bg-folly
        ">
            <div>
                <h1 className="
                    /* Layout */
                    text-center

                    /* Tipografía */
                    anybody-logo text-[13vw] sm:text-[9vw]/[80%] md:text-[7.5vw]/[80%]
                    text-aquamarine

                    /* Sombra */
                    drop-shadow-[0.1em_0.1em_0_rgba(0,0,0,0.8)]
                ">Vega<br className="hidden sm:block xl:hidden" />zetas</h1>
            </div>

            <div className="
                /* Layout */
                flex flex-row gap-[5vw] sm:gap-[3vw] items-center mb-[2vw] sm:mb-0
            ">
                <FaRegUserCircle className="
                    /* Layout */
                    rounded-full

                    /* Tamaño */
                    text-[17vw] sm:text-[14vw] md:text-[11vw] xl:text-[8.5vw]

                    /* Colores */
                    text-aquamarine bg-folly

                    /* Sombra */
                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                    lg:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                " />

                <div className="
                    /* Layout */
                    flex flex-col items-start
                ">
                    <h2 className="
                        /* Tipografía */
                        anybody-title text-[5.5vw] md:text-[4.5vw] xl:text-[3.5vw]
                        text-aquamarine

                        /* Layout */
                        -mb-1

                        /* Sombra */
                        drop-shadow-[0.7vw_0.7vw_0_rgba(0,0,0,0.8)]
                        md:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                        xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                    ">{name}</h2>
                    <p className="
                        /* Tipografía */
                        anybody text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] xl:text-[1.6vw] font-semibold
                        text-aquamarine
                    ">¿Qué vas a comer hoy?</p>
                    <button className="
                        /* Tipografía */
                        anybody text-[2.7vw] sm:text-[2vw] md:text-[1.8vw] xl:text-[1.4vw]
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