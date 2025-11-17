import { FaRegUserCircle } from "react-icons/fa"

import LogoVegazetasHeader from './LogoVegazetasHeader'
import ProfileImage from "./ProfileImage"

import logic from '../../../logic'
import { useAppContext } from '../../../context'

function Header({ onUserLoggedOut }) {
    const { alert, confirm } = useAppContext()

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

    return <header className="z-10 flex fixed top-0 min-w-screen w-full justify-center bg-veronica">
        <div className="flex items-center justify-between w-full py-3 lg:py-6 px-8 md:px-12 xl:px-14 max-w-7xl gap-2">
            <LogoVegazetasHeader to="/menu" variant="myRecipes" />

            <div className="flex gap-2 lg:gap-4 items-center align-middle justify-center">
                <button
                    className="anybody font-normal text-xs lg:text-base xl:text-lg leading-none lg:leading-tight xl:leading-tight text-sgbus-green order-1 cursor-pointer transition-all duration-150 ease-out active:scale-95
                    hover:text-black hover:font-semibold hover:-translate-y-0.5 hover:scale-105
                    focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105"
                    aria-label="Cerrar sesión"
                    type="button"
                    onClick={handleLogoutButtonClick}>
                    <span aria-hidden="true">Cerrar<br />sesión</span>
                </button>

                <ProfileImage variant="common" className="text-sgbus-green order-2" />
            </div>
        </div>
    </header>
}

export default Header