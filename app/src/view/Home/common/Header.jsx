import clsx from 'clsx'

import LogoVegazetasHeader from './LogoVegazetasHeader'
import ProfileImage from "./ProfileImage"

import logic from '../../../logic'
import { useAppContext } from '../../../context'

const VARIANTS = {
    recipe: {
        headerBg: 'bg-spring-bud',
        logoColor: 'text-folly',
        profileImgColor: 'text-folly',
        logoutBtn: 'text-folly',
        borderBottom: 'border-b-none'
    },
    saveRecipe: {
        headerBg: 'bg-folly',
        logoColor: 'text-spring-bud',
        profileImgColor: 'text-spring-bud',
        logoutBtn: 'text-spring-bud',
        borderBottom: 'border-b-none'

    },
    myRecipes: {
        headerBg: 'bg-veronica',
        logoColor: 'text-sgbus-green hover:text-folly',
        profileImgColor: 'text-sgbus-green',
        logoutBtn: 'text-sgbus-green',
        borderBottom: 'border-b-4 border-b-sgbus-green'
    },

    discover: {
        headerBg: 'bg-aquamarine',
        logoColor: 'text-hot-magenta hover:text-folly',
        profileImgColor: 'text-hot-magenta',
        logoutBtn: 'text-hot-magenta',
        borderBottom: 'border-b-4 border-b-hot-magenta'
    }
}

function Header({ onUserLoggedOut, variant = 'common' }) {
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

    const currentVariant = VARIANTS[variant]

    return <header className={clsx(
        "z-20 flex fixed top-0 min-w-screen w-full justify-center",
        "h-16 xs:h-20",
        currentVariant.headerBg,
        currentVariant.borderBottom
    )}>
        <div className="flex items-center justify-between w-full py-3 px-8 md:px-12 xl:px-14 max-w-7xl gap-2">
            <LogoVegazetasHeader to="/menu" className={currentVariant.logoColor} />

            <div className="flex gap-2 lg:gap-4 items-center align-middle justify-center">
                <button
                    className={clsx(
                        "anybody font-normal text-xs lg:text-sm leading-none lg:leading-tight xl:leading-tight order-1 cursor-pointer transition-all duration-150 ease-out active:scale-95",
                        "hover:font-semibold hover:-translate-y-0.5 hover:scale-105 hover:text-black",
                        "focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105",
                        currentVariant.logoutBtn
                    )}
                    aria-label="Cerrar sesión"
                    type="button"
                    onClick={handleLogoutButtonClick}
                >
                    <span aria-hidden="true">Cerrar<br />sesión</span>
                </button>

                <ProfileImage
                    variant="common"
                    className={clsx(currentVariant.profileImgColor, "order-2")}
                />
            </div>
        </div>
    </header>
}

export default Header