import { FaShareAlt } from "react-icons/fa"
import { FaListUl } from "react-icons/fa6"
import { MdRocketLaunch, MdVisibilityOff } from "react-icons/md"

import { useAppContext } from '../../../context'

import formatDate from '../../helper/formatDate'

import MiniCircleButton from "./MiniCircleButton"

function RecipeThumbnail({ recipe, onRecipeThumbnailClick }) {
    const { alert } = useAppContext()

    const handleRecipeThumbnailClick = event => {
        event.preventDefault()

        onRecipeThumbnailClick(recipe.id)
    }

    return <article className={`
                flex flex-col w-full relative
                drop-shadow-[0.4em_0.4em_0_rgba(0,0,0,0.8)]
                transition-all duration-150 ease-out hover:scale-105
                focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105
                ${recipe.published ? 'opacity-100' : 'opacity-60 grayscale'}
            `}>
        <header className="z-20 flex absolute top-0 left-0 right-0 p-4 xs:p-6 xl:p-6 sm:p-4 gap-3 xs:gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-4 items-center justify-between">

            <div className="flex items-center justify-start">
                {recipe.published
                    ? <MdRocketLaunch className="text-spring-bud text-2xl xs:text-3xl" title="Receta publicada" />
                    : <MdVisibilityOff className="text-spring-bud text-xl xs:text-3xl" title="Receta en borrador" />
                }
            </div>

            <div className="flex gap-3 xs:gap-4">
                <MiniCircleButton>
                    <FaShareAlt
                        onClick={() => alert('Compartir: funcionalidad cociendose a fuego lento')}
                        aria-label="Compartir receta"
                        aria-hidden="true"
                    />
                </MiniCircleButton>

                <MiniCircleButton>
                    <FaListUl
                        onClick={() => alert('Añadir a lista: funcionalidad en el horno')}
                        aria-label="Añadir a lista"
                        aria-hidden="true"
                    />
                </MiniCircleButton>
            </div>
        </header>

        <button
            className="flex items-center justify-center cursor-pointer w-full rounded-sm overflow-hidden"
            type="button"
            onClick={handleRecipeThumbnailClick}
        >
            <div className="w-full relative">
                {recipe.images && recipe.images.length > 0 ? (
                    <>
                        <div className="absolute inset-0 bg-black opacity-20 z-10" />
                        <img
                            className="w-full aspect-square object-cover"
                            src={recipe.images[0]}
                            alt={`Imagen de la receta: ${recipe.title}`}
                        />
                    </>
                ) : (
                    <div className="w-full bg-veronica aspect-square" />
                )}

                <h2 className="
                z-10 absolute inset-0 flex items-center justify-center text-center
                p-6 pt-10 xs:p-10 xs:pt-14
                anybody-logo text-spring-bud break-words
                text-2xl xs:text-4xl sm:text-2xl md:text-3xl lg:text-2xl xl:md:text-4xl
                leading-tight
                drop-shadow-[0.18em_0.18em_0_rgba(0,0,0,0.8)]
            ">
                    {recipe.title}
                </h2>
            </div>
        </button>

        <footer className="
            z-10 mx-auto
            -mt-4 xs:-mt-5 sm:-mt-4
            px-4 py-1 xs:py-2 sm:py-1
            anybody-title text-spring-bud bg-folly 
            text-sm xs:text-base sm:text-sm md:text-base lg:text-sm xl:md:text-base
            rounded-sm overflow-hidden
        ">
            <time>{formatDate(recipe.date)}</time>
        </footer>
    </article>
}

export default RecipeThumbnail