import { Link } from 'react-router-dom'
import clsx from 'clsx'

interface LogoVegazetasHeaderProps {
    to?: string
    className?: string
}

function LogoVegazetasHeader({ to, className }: LogoVegazetasHeaderProps) {
    const logoHeaderClasses = clsx(
        'anybody-logo text-4xl sm:text-5xl xl:text-6xl ',
        'drop-shadow-hard-lg xl:drop-shadow-hard-xl',
        className
    )

    const logoBtnHeaderClasses = clsx(
        'anybody-logo text-2xl xs:text-3xl md:text-4xl',
        'drop-shadow-hard-sm xs:drop-shadow-hard-md lg:drop-shadow-hard-md',
        'interactive-lift focus-ring',
        className
    )

    if (to) return <Link to={to} aria-label="Ir al menú" title="Menú" className={logoBtnHeaderClasses}>Vegazetas</Link>
    return <div className={logoHeaderClasses}>Vegazetas</div>
}

export default LogoVegazetasHeader
