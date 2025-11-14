import clsx from 'clsx'
import { FaRegUserCircle } from 'react-icons/fa'

const VARIANTS = {
    menu: `text-spring-bud text-5xl xs:text-6xl xl:text-7xl bg-folly`,
    common: `text-4xl xs:text-5xl lg:text-6xl xl:text-7xl`
}

function ProfileImage({ variant = 'common', className }) {
    const profileImgClasses = clsx(
        'rounded-full shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]',

        VARIANTS[variant],
        className
    )

    return <FaRegUserCircle className={profileImgClasses} />
}

export default ProfileImage