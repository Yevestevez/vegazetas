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
    odd: `rotate-[0.5deg] hover:-rotate-[1deg] active:rotate-[1deg]`,
    even: `-rotate-[0.5deg] hover:rotate-[1deg] active:-rotate-[1deg]`,
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
        'anybody-title font-bold text-lg xs:text-xl sm:text-2xl leading-tight',
        'shadow-hard-lg xs:shadow-hard-2xl',
        'interactive-hover focus-ring',
        className
    )

    if (to) return <Link to={to} className={MenuButtonClasses}>{children}</Link>
    return <button onClick={onClick} className={MenuButtonClasses}>{children}</button>
}

export default MenuButton
