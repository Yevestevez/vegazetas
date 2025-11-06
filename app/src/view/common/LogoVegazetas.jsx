import { Link } from 'react-router-dom'
import clsx from 'clsx'

function LogoVegazetas({
    to,
    className
}) {
    const logoClasses = clsx(
        'text-center anybody-logo',
        'text-8xl sm:text-9 lg:text-[12rem] xl:text-[14rem]',
        'leading-[0.8] sm:leading-[0.8] p-4',
        'drop-shadow-[0.6rem_0.6rem_0_rgba(0,0,0,0.8)]',
        className
    )

    const logoContent = (
        <>
            <span aria-hidden="true">Vega<br />zetas</span>
            <span className="sr-only">Vegazetas</span>
        </>
    )

    if (to) return <Link to={to} className={logoClasses}>{logoContent}</Link>
    return <div className={logoClasses}>{logoContent}</div>
}

export default LogoVegazetas