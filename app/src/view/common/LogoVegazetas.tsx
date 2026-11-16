import { Link } from 'react-router-dom'
import clsx from 'clsx'

interface LogoVegazetasProps {
    to?: string
    'aria-label'?: string
    'title'?: string
    className?: string
}

function LogoVegazetas({
    to,
    'aria-label': ariaLabel,
    'title': title,
    className
}: LogoVegazetasProps) {
    const logoClasses = clsx(
        'text-center anybody-logo',
        'text-7xl xs:text-8xl sm:text-9xl lg:text-[12rem] xl:text-[10rem]',
        'leading-[0.8] p-4',
        'drop-shadow-hard-2xl',
        className
    )

    const logoBtnClasses = clsx(
        'text-center anybody-logo',
        'text-7xl xs:text-8xl sm:text-9xl xl:text-[10rem]',
        'leading-[0.8] p-4',
        'drop-shadow-hard-2xl',
        'interactive-lift focus-ring',
        className
    )

    const logoContent = (
        <>
            <span aria-hidden="true">Vega<br />zetas</span>
            <span className="sr-only">Vegazetas</span>
        </>
    )

    if (to) return <Link to={to} aria-label={ariaLabel} title={title} className={logoBtnClasses}>{logoContent}</Link>

    return <div aria-label={ariaLabel} title={title} className={logoClasses}>{logoContent}</div>
}

export default LogoVegazetas
