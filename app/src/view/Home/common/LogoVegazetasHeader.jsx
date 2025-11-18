import { Link } from 'react-router-dom'
import clsx from 'clsx'

function LogoVegazetasHeader({ to, className }) {
    const logoHeaderClasses = clsx(
        'anybody-logo text-4xl sm:text-5xl xl:text-6xl ',
        'drop-shadow-[0.4rem_0.4rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.5rem_0.5rem_0_rgba(0,0,0,0.8)]',
        className
    )

    const logoBtnHeaderClasses = clsx(
        'anybody-logo text-2xl xs:text-3xl md:text-4xl',
        'drop-shadow-[0.2rem_0.2rem_0_rgba(0,0,0,0.8)] xs:drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)] lg:drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)]',
        'transition-all duration-150 ease-out active:scale-95',
        'hover:-translate-y-0.5 hover:scale-105',
        'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
        className
    )

    if (to) return <Link to={to} className={logoBtnHeaderClasses}>Vegazetas</Link>
    return <div className={logoHeaderClasses}>Vegazetas</div>
}

export default LogoVegazetasHeader