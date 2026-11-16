import clsx from 'clsx'
import { ReactNode } from 'react'

import LogoVegazetasHeader from './LogoVegazetasHeader'
import ProfileImage from "./ProfileImage"

import logic from '../../../logic'
import { useAppContext } from '../../../context'

type HeaderVariant = 'recipe' | 'saveRecipe' | 'myRecipes' | 'discover' | 'favorites'

interface HeaderProps {
    onUserLoggedOut: () => void
    variant?: HeaderVariant
}

const VARIANTS: Record<HeaderVariant, {
    headerBg: string
    logoColor: string
    profileImgColor: string
    logoutBtn: string
    borderBottom: string
}> = {
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
    },
    favorites: {
        headerBg: 'bg-coquelicot',
        logoColor: 'text-aquamarine hover:text-folly',
        profileImgColor: 'text-aquamarine',
        logoutBtn: 'text-aquamarine',
        borderBottom: 'border-b-4 border-b-aquamarine'
    }
}

function Header({ onUserLoggedOut, variant = 'myRecipes' }: HeaderProps) {
    const { alert, confirm } = useAppContext()

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

    const currentVariant = VARIANTS[variant]

    return <header className={clsx(
        "z-20 flex fixed top-0 min-w-screen w-full justify-center",
        "h-16 xs:h-20",
        currentVariant.headerBg
    )}>
        <div className={clsx(
            "flex items-center justify-between w-full py-3 px-8 md:px-12 xl:px-14 2xl:px-16 max-w-6xl gap-2",
            currentVariant.borderBottom
        )}>
            <LogoVegazetasHeader to="/menu" className={currentVariant.logoColor} />

            <div className="flex gap-2 lg:gap-4 items-center align-middle justify-center">
                <button
                    className={clsx(
                        "anybody font-normal text-xs lg:text-sm leading-none lg:leading-tight order-1 cursor-pointer",
                        "hover:font-semibold hover:-translate-y-0.5 hover:text-black",
                        "interactive-hover focus-ring",
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
