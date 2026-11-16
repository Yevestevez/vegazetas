import { useEffect, useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa"

import logic from '../../../logic'
import { useAppContext } from '../../../context'
import handleCredentialsError from '../../helper/handleCredentialsError'

import LogoVegazetasHeader from '../common/LogoVegazetasHeader'
import ProfileImage from '../common/ProfileImage'

import { errors } from 'com'
const { NotFoundError, SystemError } = errors

interface MenuHeaderProps {
    onUserLoggedOut: () => void
}

function MenuHeader({ onUserLoggedOut }: MenuHeaderProps) {
    const { alert, confirm } = useAppContext()

    const [name, setName] = useState<string | null>(null)

    useEffect(() => {
        let active = true

        try {
            logic.getUserName()
                .then(name => setName(name))
                .catch(error => {
                    if (!active) return

                    if (handleCredentialsError(error, alert, onUserLoggedOut)) return

                    if (error instanceof NotFoundError)
                        alert(error.message)
                    else if (error instanceof SystemError)
                        alert('sorry, try again')
                })
        } catch (error) {
            alert((error as Error).message)

            console.error(error)
        }

        return () => { active = false }
    }, [alert, onUserLoggedOut])

    const handleLogoutButtonClick = () => {
        confirm('¿Quieres cerrar sesión?', (accepted: boolean) => {
            if (accepted) {
                try {
                    logic.logoutUser()

                    onUserLoggedOut()
                } catch (error) {
                    alert((error as Error).message)

                    console.error(error)
                }
            }
        })
    }

    return <header className="z-10 flex fixed top-0 min-w-screen w-full bg-folly justify-center">
        <div className='flex flex-col md:flex-row items-center justify-center w-full max-w-6xl p-4 lg:p-6 gap-4 md:gap-12 lg:gap-20 xl:gap-24'>
            <LogoVegazetasHeader className="text-spring-bud" />

            <div className="flex flex-row justify-center items-center gap-4">
                <ProfileImage variant="menu" className="text-spring-bud" />

                <div className="flex flex-col items-start gap-0 xl:gap-1">
                    <p className="-mb-1 anybody-title font-black text-lg xl:text-2xl text-spring-bud drop-shadow-hard-md xl:drop-shadow-hard-lg
                    ">{name}</p>
                    <p className="anybody text-base xl:text-lg font-semibold text-spring-bud">¿Qué vas a comer hoy?</p>
                    <button
                        className="anybody text-xs xl:text-sm text-spring-bud cursor-pointer
                        hover:-translate-y-0.5 hover:text-black hover:font-semibold
                        interactive-hover focus-ring"
                        type="button"
                        onClick={handleLogoutButtonClick}>Cerrar sesión</button>
                </div>
            </div>
        </div>
    </header>
}

export default MenuHeader
