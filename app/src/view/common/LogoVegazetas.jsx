import { Link } from 'react-router-dom'
import clsx from 'clsx'

function LogoVegazetas({
    to,
    className
}) {
    const logoClasses = clsx(
        'text-center anybody-logo',
        'text-7xl xs:text-8xl sm:text-9xl lg:text-[12rem] xl:text-[10rem]',
        'leading-[0.8] xs:leading-[0.8] sm:leading-[0.8] p-4',
        'drop-shadow-[0.6rem_0.6rem_0_rgba(0,0,0,0.8)]',
        className
    )

    const logoBtnClasses = clsx(
        'text-center anybody-logo',
        'text-7xl xs:text-8xl sm:text-9xl xl:text-[10rem]',
        'leading-[0.8] xs:leading-[0.8] sm:leading-[0.8] p-4',
        'drop-shadow-[0.6rem_0.6rem_0_rgba(0,0,0,0.8)]',
        'transition-all duration-150 ease-out active:scale-95',
        'hover:-translate-y-2 hover:scale-105',
        'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
        className
    )

    const logoContent = (
        <>
            <span aria-hidden="true">Vega<br />zetas</span>
            <span className="sr-only">Vegazetas</span>
        </>
    )

    if (to) return <Link to={to} className={logoBtnClasses}>{logoContent}</Link>
    return <div className={logoClasses}>{logoContent}</div>
}

export default LogoVegazetas