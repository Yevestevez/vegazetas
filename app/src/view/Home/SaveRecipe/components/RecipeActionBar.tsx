import { useNavigate } from 'react-router-dom'
import { FaChevronLeft, FaChevronUp } from 'react-icons/fa'
import { MdRemoveRedEye, MdDelete } from 'react-icons/md'

import MiniCircleButton from '../../shared/MiniCircleButton'

interface RecipeActionBarProps {
    onToRecipeClicked: () => void
    onDeleteClicked: () => void
}

function RecipeActionBar({ onToRecipeClicked, onDeleteClicked }: RecipeActionBarProps) {
    const navigate = useNavigate()

    return (
        <section
            aria-labelledby="recipe-action-title"
            className="z-20 w-full flex items-center justify-center fixed left-0 top-16 xs:top-20 py-4 bg-spring-bud border-b-4 border-b-folly h-16">
            <h2 id="recipe-actions-title" className="sr-only">
                Botonera de acciones y navegación de la receta
            </h2>

            <div className="flex justify-between px-8 md:px-12 xl:px-14 2xl:px-16 w-full max-w-6xl">
                <nav className='flex gap-3 xs:gap-4'>
                    <MiniCircleButton onClick={() => {
                        if (window.history.length > 2) navigate(-1);
                        else navigate("/home");
                    }} variant="saveRecipe" title="Atrás" className="pr-1">
                        <FaChevronLeft aria-hidden="true" />
                    </MiniCircleButton>

                    <MiniCircleButton onClick={(e) => {
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }} variant="saveRecipe" title="Arriba" aria-label="Arriba">
                        <FaChevronUp aria-hidden="true" />
                    </MiniCircleButton>
                </nav>

                <div className='flex gap-3 xs:gap-4' role="toolbar" aria-label="Acciones de receta">
                    <MiniCircleButton onClick={onToRecipeClicked} aria-label="Ver receta" title="Ver receta" variant="saveRecipe">
                        <MdRemoveRedEye aria-hidden="true" />
                    </MiniCircleButton>

                    <MiniCircleButton onClick={onDeleteClicked} aria-label="Eliminar receta" title="Eliminar receta" variant="saveRecipe">
                        <MdDelete aria-hidden="true" />
                    </MiniCircleButton>
                </div>
            </div>
        </section>
    )
}

export default RecipeActionBar
