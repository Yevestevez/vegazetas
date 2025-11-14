import { Link } from 'react-router-dom'
import clsx from 'clsx'

const COLOR_VARIANTS = {
    menu: `text-spring-bud`,
    myRecipes: `text-sgbus-green hover:text-folly`,
}

function LogoVegazetasHeader({ to, variant, className }) {
    const logoHeaderClasses = clsx(
        'anybody-logo text-4xl sm:text-5xl xl:text-6xl ',
        'drop-shadow-[0.4rem_0.4rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.5rem_0.5rem_0_rgba(0,0,0,0.8)]',
        COLOR_VARIANTS[variant],
        className
    )

    const logoBtnHeaderClasses = clsx(
        'anybody-logo text-2xl xs:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl',
        'drop-shadow-[0.4rem_0.4rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.5rem_0.5rem_0_rgba(0,0,0,0.8)]',
        'transition-all duration-150 ease-out active:scale-95',
        'hover:-translate-y-0.5 hover:scale-105',
        'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
        COLOR_VARIANTS[variant],
        className
    )

    if (to) return <Link to={to} className={logoBtnHeaderClasses}>Vegazetas</Link>
    return <div className={logoHeaderClasses}>Vegazetas</div>
}

export default LogoVegazetasHeader