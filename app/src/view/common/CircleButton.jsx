import { Link } from 'react-router-dom'
import clsx from 'clsx'

const SIZE_VARIANTS = {
  small: `
    size-16 xs:size-20 sm:size-24 md:size-28 lg:size-32 xl:size-36 2xl:size-40
    text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]
  `,
  large: `
    size-20 xs:size-24 sm:size-28 lg:size-32
    text-sm xs:text-xl lg:text-2xl
    shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.6rem_0.6rem_0_0_rgba(0,0,0,0.8)]
  `
}

function CircleButton({
  to,
  onClick,
  children,
  variant = 'large',
  className
}) {
  const btnClasses = clsx(
    SIZE_VARIANTS[variant],
    'flex items-center justify-center rounded-full anybody-logo font-black',

    'transition-all duration-150 ease-out active:scale-95',
    'hover:-translate-y-2 hover:scale-105',
    'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
    className
  )

  if (to) return <Link to={to} className={btnClasses}>{children}</Link>
  return <button onClick={onClick} className={btnClasses}>{children}</button>
}

export default CircleButton