import { Link } from 'react-router-dom'
import clsx from 'clsx'

const VARIANTS = {
    odd: `rotate-1 hover:-rotate-2 active:rotate-2`,
    even: `-rotate-1 hover:rotate-2 active:-rotate-2`,
}

function MenuButton({
    to,
    onClick,
    children,
    variant = 'odd',
    className
}) {
    const MenuButtonClasses = clsx(
        VARIANTS[variant],
        'flex items-center justify-center p-2 xs:p-4 ',
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