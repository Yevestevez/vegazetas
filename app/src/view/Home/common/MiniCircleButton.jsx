import { Link } from 'react-router-dom'
import clsx from 'clsx'

const VARIANTS = {
  recipeThumbnail: `
    pr-0.5
    size-8 xs:size-10 sm:size-8 md:size-10 lg:size-8 xl:size-10
    text-base xs:text-xl sm:text-base md:text-xl lg:text-base xl:text-xl
    bg-folly text-spring-bud
    hover:bg-spring-bud hover:text-folly
    shadow-[0.2rem_0.2rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]
  `,
  recipe: `
    size-7 xs:size-8 md:size-9
    text-xl md:text-2xl
    bg-spring-bud text-folly
    outline-none
    hover:bg-folly hover:text-spring-bud hover:outline-4 hover:outline-spring-bud hover:outline-offset-0
    shadow-[0.2rem_0.2rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]
  `,
  saveRecipe: `
    size-7 xs:size-8 md:size-9
    text-xl md:text-2xl
    bg-folly text-spring-bud
    outline-none
    hover:bg-spring-bud hover:text-folly hover:outline-4 hover:outline-folly hover:outline-offset-0
    shadow-[0.2rem_0.2rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]
  `
}

function MiniCircleButton({
  to,
  onClick,
  children,
  variant = 'recipeThumbnail',
  'aria-label': ariaLabel,
  className
}) {
  const btnClasses = clsx(
    VARIANTS[variant],
    'flex items-center justify-center rounded-full cursor-pointer',
    'transition-all duration-150 ease-out active:scale-95',
    'hover:-translate-y-1 hover:scale-105',
    'focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105',
    className
  )

  if (to) return <Link to={to} aria-label={ariaLabel} className={btnClasses}>{children}</Link>
  return <button onClick={onClick} aria-label={ariaLabel} className={btnClasses}>{children}</button>
}

export default MiniCircleButton