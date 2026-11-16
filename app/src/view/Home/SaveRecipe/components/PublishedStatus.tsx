import { MdRocketLaunch, MdCancel } from 'react-icons/md'

import MiniCircleButton from '../../common/MiniCircleButton'

interface PublishedStatusProps {
    published: boolean
    onTogglePublish: () => void
}

function PublishedStatus({ published, onTogglePublish }: PublishedStatusProps) {
    return (
        <div className="flex flex-col py-2 gap-2 xs:gap-4 xl:gap-6">
            <p className="text-spring-bud text-lg xs:text-xl xl:text-2xl">
                {published ? (
                    <>Tu receta está <strong>publicada</strong></>
                ) : (
                    <>Tu receta es un <strong>borrador</strong></>
                )}
            </p>

            <div className="flex gap-4 items-center justify-center">
                <p className="text-spring-bud text-sm xs:text-base xl:text-lg text-end leading-tight">
                    {published ? (
                        <>¿Quieres pasar esta <br /> receta a <strong>borrador</strong>?</>
                    ) : (
                        <>¿Quieres <strong>publicar</strong> <br /> tu receta?</>
                    )}
                </p>

                <MiniCircleButton variant="recipe" onClick={onTogglePublish} aria-label={published ? 'Pasar receta a borrador' : 'Publicar receta'} title={published ? 'Pasar receta a borrador' : 'Publicar receta'}>
                    {published ? <MdCancel aria-hidden="true" /> : <MdRocketLaunch aria-hidden="true" />}
                </MiniCircleButton>
            </div>
        </div>
    )
}

export default PublishedStatus
