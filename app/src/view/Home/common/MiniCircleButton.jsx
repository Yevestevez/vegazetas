import { Link } from 'react-router-dom'
import clsx from 'clsx'

const VARIANTS = {
    recipeThumbnail: `
    pr-0.5
    size-8 xs:size-10 sm:size-8 md:size-10 lg:size-8 xl:size-10
    text-base xs:text-xl sm:text-base md:text-xl lg:text-base xl:text-xl
    bg-folly text-spring-bud
    hover:bg-spring-bud hover:text-folly
  `,
    recipe: `

  `
}

function MiniCircleButton({
    to,
    onClick,
    children,
    variant = 'recipeThumbnail',
    className
}) {
    const btnClasses = clsx(
        VARIANTS[variant],
        'flex items-center justify-center rounded-full',
        'shadow-[0.2rem_0.2rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]',
        'transition-all duration-150 ease-out active:scale-95',
        'hover:-translate-y-1 hover:scale-105',
        'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
        className
    )

    if (to) return <Link to={to} className={btnClasses}>{children}</Link>
    return <button onClick={onClick} className={btnClasses}>{children}</button>
}

export default MiniCircleButton