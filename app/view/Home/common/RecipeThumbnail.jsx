import { useAppContext } from '../../../context'

import { FaShareAlt } from "react-icons/fa"
import { FaListUl } from "react-icons/fa6"
import formatDate from '../../helper/formatDate'

function RecipeThumbnail({ recipe, onRecipeThumbnailClick }) {
    const { alert, confirm } = useAppContext()

    const handleRecipeThumbnailClick = event => {
        event.preventDefault()

        onRecipeThumbnailClick(recipe.id)
    }

    console.log('RecipeThumbnail -> render')

    return <article className="flex flex-col pb-10 bg-canary">
        <button className="relative flex items-center justify-center" type="button" onClick={handleRecipeThumbnailClick}>
            <h2 className="flex absolute z-2 px-10 anybody-logo text-spring-bud text-[13vw]/[90%] drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)] ">{recipe.title}</h2>

            <div className="relative w-full">
                {recipe.images && recipe.images.length > 0 ? (
                    <>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center"></div>
                        <img className="flex h-100 w-full object-cover justify-center" src={recipe.images[0]} alt="Imagen de receta" />
                    </>
                ) : (
                    <div className="h-100 bg-violet"></div>
                )}
            </div>
        </button>

        <time className="mx-auto py-1.5 px-5 -mt-6 w-auto flex justify-center items-center z-1 anybody-title text-folly bg-spring-bud text-[4vw] drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]">{formatDate(recipe.date)}</time>

        <div className="absolute flex flex-row justify-end w-full gap-3 p-4 opacity-50">
            <button className="flex items-center justify-center w-9 h-9 rounded-full text-[5vw] text-spring-bud bg-folly  drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]" type="button" onClick={() => alert('Compartir: funcionalidad cociendose a fuego lento')}><FaShareAlt /></button>
            <button className="flex items-center justify-center w-9 h-9 rounded-full text-[5vw] text-spring-bud bg-folly drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]" type="button" onClick={() => alert('Añadir a lista: funcionalidad en el horno')}><FaListUl /></button>
        </div>
    </article >
}

export default RecipeThumbnail