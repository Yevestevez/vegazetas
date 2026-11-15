import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ReactNode } from 'react'

type MenuButtonVariant = 'odd' | 'even'

interface MenuButtonProps {
    to?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    children: ReactNode
    variant?: MenuButtonVariant
    className?: string
}

const VARIANTS: Record<MenuButtonVariant, string> = {
    odd: `rotate-1 hover:-rotate-2 active:rotate-2`,
    even: `-rotate-1 hover:rotate-2 active:-rotate-2`,
}

function MenuButton({
    to,
    onClick,
    children,
    variant = 'odd',
    className
}: MenuButtonProps) {
    const MenuButtonClasses = clsx(
        VARIANTS[variant],
        'flex items-center justify-center p-2 xs:p-4',
        'anybody-title font-bold text-lg xs:text-xl sm:text-2xl leading-tight xs:leading-tight sm:leading-tight',
        'shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.6rem_0.6rem_0_0_rgba(0,0,0,0.8)]',
        'transition-all duration-150 ease-out ',
        'hover:scale-105 active:scale-95',
        'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
        className
    )

    if (to) return <Link to={to} className={MenuButtonClasses}>{children}</Link>
    return <button onClick={onClick} className={MenuButtonClasses}>{children}</button>
}

export default MenuButton
