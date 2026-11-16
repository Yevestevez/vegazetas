import { MdDelete } from 'react-icons/md'

import MiniCircleButton from '../../common/MiniCircleButton'
import type { Ingredient } from '../../../../types/recipe'

interface IngredientListProps {
    mainIngredients: Ingredient[]
    pantryIngredients: Ingredient[]
    onDeleteIngredient: (ingredientId: string) => void
}

function IngredientList({ mainIngredients, pantryIngredients, onDeleteIngredient }: IngredientListProps) {
    const h3Base = `mx-auto px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-sm shadow-hard-md xl:shadow-hard-lg`

    return (
        <div className="columns-1 lg:columns-2 2xl:columns-3 gap-6 space-y-6">
            {mainIngredients.length > 0 && (
                <section aria-labelledby="main-ingredients" className="flex flex-col py-2 gap-2">
                    <h3 id="main-ingredients" className={`${h3Base} text-spring-bud bg-folly`}>Principales</h3>

                    <ul className="flex flex-col gap-2">
                        {mainIngredients.map((ingredient: Ingredient, index: number) => (
                            <li key={index} className="flex items-center gap-3 xs:gap-4 text-folly">
                                <MiniCircleButton aria-label="Eliminar ingrediente" title="Eliminar ingrediente" onClick={(event) => onDeleteIngredient(ingredient.id)} variant="saveRecipe" className="shrink-0"><MdDelete aria-hidden="true" /></MiniCircleButton>

                                <p className="text-sm sm:text-base leading-tight">
                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {pantryIngredients.length > 0 && (
                <section aria-labelledby="pantry-ingredients" className="flex flex-col py-2 gap-2">
                    <h3 id="pantry-ingredients" className={`${h3Base} text-spring-bud bg-folly`}>Despensa</h3>

                    <ul className="flex flex-col gap-2">
                        {pantryIngredients.map((ingredient: Ingredient, index: number) => (
                            <li key={index} className="flex items-center gap-3 xs:gap-4 text-folly">
                                <MiniCircleButton aria-label="Eliminar ingrediente" title="Eliminar ingrediente" onClick={(event) => onDeleteIngredient(ingredient.id)} variant="saveRecipe" className="shrink-0"><MdDelete aria-hidden="true" /></MiniCircleButton>

                                <p className="text-sm sm:text-base leading-tight">
                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}

export default IngredientList
