import clsx from 'clsx'

function SectionTitle({ children, className }) {
    const sectionTitleClasses = clsx(
        'flex items-center justify-center text-center',
        'py-2 px-4',
        'anybody-title text-lg xs:text-2xl',
        'drop-shadow-[0.6rem_0.6rem_0_rgba(0,0,0,0.8)]',
        className)

    return <h1 className={sectionTitleClasses}>{children}</h1>
}

export default SectionTitle