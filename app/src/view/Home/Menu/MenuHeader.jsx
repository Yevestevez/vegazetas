import { useEffect, useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa"

import logic from '../../../logic'
import { useAppContext } from '../../../context'

import LogoVegazetasHeader from '../common/LogoVegazetasHeader'

import { errors } from 'com'
const { NotFoundError, SystemError } = errors

function Header({ onUserLoggedOut }) {
    const { alert, confirm } = useAppContext()

    const [name, setName] = useState(null)

    useEffect(() => {
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

    return <header className="min-w-screen w-full bg-folly flex justify-center">
        <div className='flex flex-col md:flex-row items-center justify-center w-full max-w-7xl p-4 lg:p-6 gap-4 md:gap-10 xl:gap-14'>
            <LogoVegazetasHeader />

            <div className="flex flex-row justify-center items-center gap-4">
                <FaRegUserCircle className="rounded-full text-spring-bud text-5xl  xs:text-6xl xl:text-7xl bg-folly shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]" />

                <div className="flex flex-col items-start gap-0 xl:gap-1">
                    <p className="-mb-1 anybody-title font-black text-lg xl:text-2xl text-spring-bud drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4rem_0.4rem_0_rgba(0,0,0,0.8)]
                    ">{name}</p>
                    <p className="anybody text-base xl:text-lg font-semibold text-spring-bud">¿Qué vas a comer hoy?</p>
                    <button
                        className="anybody text-xs xl:text-sm text-spring-bud cursor-pointer
                        transition-all duration-150 ease-out active:scale-95
                        hover:-translate-y-0.5 hover:scale-105 hover:text-black hover:font-semibold
                        focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105"
                        type="button"
                        onClick={handleLogoutButtonClick}>Cerrar sesión</button>
                </div>
            </div>
        </div>
    </header>
}

export default Header