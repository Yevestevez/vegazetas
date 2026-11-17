import clsx from 'clsx'
import { FaRegUserCircle } from 'react-icons/fa'

type ProfileImageVariant = 'menu' | 'common'

interface ProfileImageProps {
    variant?: ProfileImageVariant
    className?: string
}

const VARIANTS: Record<ProfileImageVariant, string> = {
    menu: `text-5xl xs:text-6xl xl:text-7xl`,
    common: `text-4xl xs:text-5xl `
}

function ProfileImage({ variant = 'common', className }: ProfileImageProps) {
    const profileImgClasses = clsx(
        'rounded-full shadow-hard-sm xs:shadow-hard-md xl:shadow-hard-md',

        VARIANTS[variant],
        className
    )

    return <FaRegUserCircle className={profileImgClasses} />
}

export default ProfileImage
