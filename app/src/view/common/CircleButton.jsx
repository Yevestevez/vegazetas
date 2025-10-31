import { Link } from 'react-router-dom'
import clsx from 'clsx'

function CircleButton({
    to,                 // ruta si es Link
    onClick,            // handler si es botón normal
    children,           // lo que va dentro del botón
    size = '8vw',       // tamaño del botón (ancho/alto)
    textSize = '2vw',   // tamaño del texto
    bgColor = 'bg-spring-bud',       // fondo
    textColor = 'text-folly',        // color del texto
    hoverBgColor = 'hover:bg-violet',
    hoverTextColor = 'hover:text-hot-magenta',
    className           // clases extra
}) {
    const btnClasses = clsx(
        'flex items-center justify-center rounded-full font-bold drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]',
        'transition-transform duration-150 ease-out hover:-translate-y-2 hover:scale-105',
        'focus:outline-none focus:ring-4 focus:ring-aquamarine',
        bgColor,
        textColor,
        hoverBgColor,
        hoverTextColor,
        className,
        `w-[${size}] h-[${size}] text-[${textSize}]`
    )

    if (to) {
        return <Link to={to} className={btnClasses}>{children}</Link>
    }

    return <button onClick={onClick} className={btnClasses}>{children}</button>
}

export default CircleButton