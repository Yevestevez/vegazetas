import { useAppContext } from '../../../context'

import { FaShareAlt } from "react-icons/fa"
import { FaListUl } from "react-icons/fa6"
import formatDate from '../../helper/formatDate'

function RecipeThumbnail({ recipe, onRecipeThumbnailClick }) {
    const { alert } = useAppContext()

    const handleRecipeThumbnailClick = event => {
        event.preventDefault()

        onRecipeThumbnailClick(recipe.id)
    }

    return <article className="flex flex-col pb-[8vw] xl:pb-[2vw] w-full bg-canary">
        <button className="relative flex items-center justify-center cursor-pointer" type="button" onClick={handleRecipeThumbnailClick}>
            <h2 className="
                flex absolute z-2 px-[8vw] xl:px-[4vw] anybody-logo text-spring-bud
                text-[12vw]/[100%] sm:text-[11vw]/[100%] lg:text-[10vw]/[100%] xl:text-[3vw]/[100%]
                drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.1em_0.1em_0_rgba(0,0,0,0.8)]
            ">{recipe.title}</h2>

            <div className="relative min-w-full">
                {recipe.images && recipe.images.length > 0 ? (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20"></div>
                        <img
                            className="flex w-full justify-center h-[90vw] sm:h-[80vw] md:h-[70vw] lg:h-[60vw] xl:h-[20vw] object-cover"
                            src={recipe.images[0]}
                            alt="Imagen de receta" />
                    </>
                ) : (
                    <div className="h-[90vw] sm:h-[80vw] md:h-[70vw] lg:h-[60vw] xl:h-[20vw] bg-violet"></div>
                )}
            </div>
        </button>

        <time className="
            mx-auto w-auto flex justify-center items-center z-1
            py-[1.5vw] xl:py-[0.5vw] px-[4vw] xl:px-[1vw]
            -mt-[5vw] sm:-mt-[4vw] xl:-mt-[1.2vw]

            anybody-title text-folly bg-spring-bud text-[4vw] sm:text-[3.5vw] md:text-[3.2vw] xl:text-[1vw]

            drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.5vw_0.5vw_0_rgba(0,0,0,0.8)]
        ">{formatDate(recipe.date)}</time>

        <div className="absolute flex flex-row justify-end opacity-50 right-0 xl:right-[24.5vw] w-full gap-[3vw] lg:gap-[2.5vw] xl:gap-[0.8vw] p-[4vw] lg:p-[3vw] xl:p-[1vw] pr-[5vw]">
            <button className="
                flex items-center justify-center rounded-full
                pr-[0.7vw] xl:pr-[0.5vw]
                w-[9vw] sm:w-[7.5vw] lg:w-[6vw] xl:w-[2.5vw]
                h-[9vw] sm:h-[7.5vw] lg:h-[6vw] xl:h-[2.5vw]

                text-[5vw] sm:text-[4vw] lg:text-[3.5vw] xl:text-[1.4vw]
                text-spring-bud bg-folly

                drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.8)]
            " type="button" onClick={() => alert('Compartir: funcionalidad cociendose a fuego lento')}><FaShareAlt /></button>
            <button className="
                flex items-center justify-center rounded-full
                w-[9vw] sm:w-[7.5vw] lg:w-[6vw] xl:w-[2.5vw]
                h-[9vw] sm:h-[7.5vw] lg:h-[6vw] xl:h-[2.5vw]

                text-[5vw] sm:text-[4vw] lg:text-[3.5vw] xl:text-[1.5vw]
                text-spring-bud bg-folly

                drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.8)]
            " type="button" onClick={() => alert('Añadir a lista: funcionalidad en el horno')}><FaListUl /></button>
        </div>
    </article >
}

export default RecipeThumbnail