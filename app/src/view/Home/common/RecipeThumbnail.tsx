import { FaShareAlt, FaStar } from "react-icons/fa"
import { FaListUl } from "react-icons/fa6"
import { MdRocketLaunch, MdVisibilityOff } from "react-icons/md"

import { useAppContext } from '../../../context'

import formatDate from '../../helper/formatDate'
import type { RecipeListItemWithAuthor } from '../../../types/recipe'

import MiniCircleButton from "./MiniCircleButton"

type RecipeThumbnailVariant = 'discover' | 'favorites'

interface RecipeThumbnailProps {
    recipe: RecipeListItemWithAuthor
    onRecipeThumbnailClick: (recipeId: string) => void
    onToggleFavoriteClick: () => void
    variant?: RecipeThumbnailVariant
    onRecipeDeleted?: () => void
    onRecipeUpdated?: () => void
}

const VARIANTS: Record<RecipeThumbnailVariant, {
    bgColor: string
    textColor: string
}> = {
    discover: {
        bgColor: 'bg-aquamarine',
        textColor: 'text-hot-magenta'
    },
    favorites: {
        bgColor: 'bg-coquelicot',
        textColor: 'text-aquamarine'
    }
}

function RecipeThumbnail({ recipe, onRecipeThumbnailClick, onToggleFavoriteClick, variant = 'discover' }: RecipeThumbnailProps) {
    const { alert } = useAppContext()

    const handleToggleFavoriteClick = (event: React.MouseEvent) => {
        event.preventDefault()

        onToggleFavoriteClick()
    }

    const handleRecipeThumbnailClick = (event: React.MouseEvent) => {
        event.preventDefault()

        onRecipeThumbnailClick(recipe.id)
    }

    const currentVariant = VARIANTS[variant]

    return <article className={`
                flex flex-col w-full relative
                drop-shadow-hard-lg
                interactive-hover focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105
                ${recipe.published ? 'opacity-100' : 'opacity-60 grayscale'}
            `}>
        <header className="z-20 flex absolute top-0 left-0 right-0 p-3 xs:p-5 xl:p-5 sm:p-3 2xl:p-3 gap-3 xs:gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-4 2xl:gap-3 items-center justify-between">

            <div className="flex items-center justify-start">
                {recipe.own &&
                    <div className="flex items-center justify-start">
                        {recipe.published
                            ? <MdRocketLaunch className="text-spring-bud text-2xl xs:text-3xl 2xl:text-xl" title="Receta publicada" />
                            : <MdVisibilityOff className="text-spring-bud text-xl xs:text-3xl 2xl:text-xl" title="Receta en borrador" />
                        }
                    </div>
                }
            </div>

            <div className="flex gap-3 xs:gap-4">
                <MiniCircleButton
                    onClick={handleToggleFavoriteClick}
                    aria-label="Añadir a recetas favoritas"
                    title="Añadir a favoritos"
                >
                    <FaStar aria-hidden="true" style={{ opacity: recipe.isFavorite ? 1 : 0.3 }} />
                </MiniCircleButton>

                <MiniCircleButton
                    onClick={() => alert('Añadir a lista: funcionalidad en el horno')}
                    aria-label="Añadir a lista"
                    title="Añadir a lista"
                >
                    <FaListUl aria-hidden="true" />
                </MiniCircleButton>

                <MiniCircleButton
                    onClick={() => alert('Compartir: funcionalidad cociendose a fuego lento')}
                    aria-label="Compartir receta"
                    title="Compartir receta"
                >
                    <FaShareAlt aria-hidden="true" />
                </MiniCircleButton>
            </div>
        </header>

        <button
            className="flex items-center justify-center cursor-pointer w-full rounded-xs overflow-hidden"
            type="button"
            aria-label="Ir a la receta" title="Ir a la receta"
            onClick={handleRecipeThumbnailClick}
        >
            <div className="w-full relative">
                {recipe.images && recipe.images.length > 0 ? (
                    <>
                        <div className="absolute inset-0 bg-black opacity-25 z-10" />
                        <img
                            className="w-full aspect-square object-cover"
                            src={recipe.images[0]}
                            alt={`Imagen de la receta: ${recipe.title}`}
                        />
                    </>
                ) : (
                    <div className={`${currentVariant.bgColor} w-full aspect-square`} />
                )}

                <h2 className={`
                ${currentVariant.textColor}
                z-10 absolute inset-0 flex items-center justify-center text-center
                p-4 pt-8 xs:p-8 xs:pt-12 2xl:p-4 2xl:pt-8
                anybody-logo break-words
                text-2xl xs:text-4xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-xl
                leading-tight
                drop-shadow-hard-sm
            `}>
                    {recipe.title}
                </h2>
            </div>
        </button>

        <footer className="
            z-10 mx-auto
            -mt-4 xs:-mt-5 sm:-mt-4 2xl:-mt-4
            px-3 py-1 xs:py-2 sm:py-1 2xl:px-3 2xl:py-1
            text-spring-bud bg-folly 
            rounded-xs overflow-hidden flex flex-col
        ">
            <p className="anybody-title text-base xs:text-lg sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-base">{`@${recipe.author.username}`}</p>
            <time className="text-sm xs:text-base sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-sm">{formatDate(recipe.date)}</time>
        </footer>
    </article>
}

export default RecipeThumbnail
