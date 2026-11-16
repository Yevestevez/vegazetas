import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ReactNode } from 'react'

type MiniCircleButtonVariant = 'recipeThumbnail' | 'recipe' | 'saveRecipe'

interface MiniCircleButtonProps {
    to?: string
    onClick?: (event: React.MouseEvent) => void
    children: ReactNode
    variant?: MiniCircleButtonVariant
    'aria-label'?: string
    'title'?: string
    className?: string
}

const VARIANTS: Record<MiniCircleButtonVariant, string> = {
  recipeThumbnail: `
    pr-0.5
    size-8 xs:size-10 sm:size-8 md:size-10 lg:size-8 xl:size-10 2xl:size-8
    text-base xs:text-xl sm:text-base md:text-xl lg:text-base xl:text-xl 2xl:text-base
    bg-folly text-spring-bud
    hover:bg-spring-bud hover:text-folly
    shadow-hard-sm xs:shadow-hard-md 2xl:shadow-hard-md
  `,
  recipe: `
    size-7 xs:size-8 md:size-9 2xl:size-7
    text-xl md:text-2xl 2xl:text-xl
    bg-spring-bud text-folly
    outline-none
    hover:bg-folly hover:text-spring-bud hover:outline-4 hover:outline-spring-bud hover:outline-offset-0
    shadow-hard-sm xs:shadow-hard-md 2xl:shadow-hard-sm
  `,
  saveRecipe: `
    size-7 xs:size-8 md:size-9 2xl:size-7
    text-xl md:text-2xl 2xl:text-xl
    bg-folly text-spring-bud
    outline-none
    hover:bg-spring-bud hover:text-folly hover:outline-4 hover:outline-folly hover:outline-offset-0
    shadow-hard-sm xs:shadow-hard-md 2xl:shadow-hard-sm
  `
}

function MiniCircleButton({
  to,
  onClick,
  children,
  variant = 'recipeThumbnail',
  'aria-label': ariaLabel,
  'title': title,
  className
}: MiniCircleButtonProps) {
  const btnClasses = clsx(
    VARIANTS[variant],
    'flex items-center justify-center rounded-full cursor-pointer',
    'interactive-lift focus-ring',
    className
  )

  if (to) return <Link to={to} aria-label={ariaLabel} title={title} className={btnClasses}>{children}</Link>
  return <button onClick={onClick} aria-label={ariaLabel} title={title} className={btnClasses}>{children}</button>
}

export default MiniCircleButton
