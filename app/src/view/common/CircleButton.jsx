import { Link } from 'react-router-dom'
import clsx from 'clsx'

const SIZE_VARIANTS = {
  small: `
    size-16 xs:size-20 sm:size-22 md:size-24 xl:size-28
    text-sm xs:text-sm sm:text-base md:text-lg lg:text-xl
    leading-tight sm:leading-tight md:leading-tight lg:leading-tight
    shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]
  `,
  large: `
    size-20 xs:size-24 sm:size-28 lg:size-32
    text-sm xs:text-base lg:text-2xl
    shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.6rem_0.6rem_0_0_rgba(0,0,0,0.8)]
  `,
  saveRecipe: `
    size-14 xs:size-16 sm:size-22 xl:size-24
    text-3xl xs:text-4xl xl:text-5xl
    leading-tight sm:leading-tight md:leading-tight lg:leading-tight
    shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]
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
    'flex items-center justify-center rounded-full anybody-logo font-black leading-tight xs:leading-tight',

    'transition-all duration-150 ease-out active:scale-95',
    'hover:-translate-y-2 hover:scale-105',
    'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
    className
  )

  if (to) return <Link to={to} className={btnClasses}>{children}</Link>
  return <button onClick={onClick} className={btnClasses}>{children}</button>
}

export default CircleButton