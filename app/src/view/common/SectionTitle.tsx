import clsx from 'clsx'
import { ReactNode } from 'react'

interface SectionTitleProps {
    children: ReactNode
    className?: string
}

function SectionTitle({ children, className }: SectionTitleProps) {
    const sectionTitleClasses = clsx(
        'flex items-center justify-center text-center',
        'py-2 px-4',
        'anybody-title text-lg xs:text-2xl',
        'drop-shadow-hard-2xl',
        className)

    return <h1 className={sectionTitleClasses}>{children}</h1>
}

export default SectionTitle
