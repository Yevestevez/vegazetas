import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"

import { FaChevronUp, FaChevronLeft, FaStar, FaShareAlt, FaEye, FaHeart } from "react-icons/fa"
import { FaListUl, FaUtensils } from "react-icons/fa6"
import { MdDelete, MdEdit } from "react-icons/md"

import { useAppContext } from '../../../context'
import logic from '../../../logic'
import formatDate from '../../../util/formatDate'
import handleCredentialsError from '../../../util/handleCredentialsError'
import type { RecipeData } from '../../../types/recipe'

import Header from './Header'
import MiniCircleButton from './MiniCircleButton'
import Footer from '../../components/Footer'

interface RecipeProps {
    onUserLoggedOut: () => void
    onEditRecipeClicked: (recipeId: string) => void
    onRecipeDeleted: () => void
}

function Recipe({
    onUserLoggedOut,
    onEditRecipeClicked,
    onRecipeDeleted,
}: RecipeProps) {
    const { alert, confirm } = useAppContext()
    const navigate = useNavigate()

    const { id: recipeId } = useParams()

    const [recipe, setRecipe] = useState<RecipeData | null>(null)

    useEffect(() => {
        if (!recipeId) return
        let active = true

        logic.getRecipeById(recipeId)
            .then((data: any) => { if (active) setRecipe(data) })
            .catch(error => {
                if (!active || handleCredentialsError(error, alert, onUserLoggedOut)) return
                alert('Error al cargar la receta')
                console.error(error)
            })

        return () => { active = false }
    }, [recipeId, alert, onUserLoggedOut])

    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleEditRecipeButton = (event: React.MouseEvent) => {
        event.preventDefault()

        if (recipe) onEditRecipeClicked(recipe.id)
    }

    const handleDeleteButtonClick = () => {
        if (!recipe) return
        confirm('¿Quieres borrar esta receta?', (accepted: boolean) => {
            if (accepted) {
                try {
                    logic.deleteRecipe(recipe.id)
                        .then(() => onRecipeDeleted())
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert((error as Error).message)

                    console.error(error)
                }
            }
        })
    }

    const handleToggleFavoriteClick = () => {
        if (!recipe) return
        logic.toggleFavoriteRecipe(recipe.id)
            .then(() => logic.getRecipeById(recipeId as string))
            .then((data: any) => setRecipe(data))
            .catch(error => {
                if (handleCredentialsError(error, alert, onUserLoggedOut)) return
                alert(error.message)
                console.error(error)
            })

        alert(recipe.isFavorite ? 'Receta eliminada de favoritos' : 'Receta añadida a favoritos')
    }

    const difficultyMap: Record<string, string> = {
        easy: "fácil",
        medium: "media",
        difficult: "difícil"
    }

    const categoryMap: Record<string, string> = {
        entrante: "Entrante",
        principal: "Principal",
        postre: "Postre",
        sopa: "Sopa",
        ensalada: "Ensalada",
        snack: "Snack",
        bebida: "Bebida",
        otro: "Otro"
    }

    const sourceMap: Record<string, string> = {
        'manual': "Manual",
        'ai-generated': "Generada por IA",
        'url-import': "Importada"
    }

    if (!recipe) return <p>Cargando receta...</p>

    return <div className="flex flex-col min-h-screen w-full items-center bg-spring-bud">
        <Header
            variant="recipe"
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="flex flex-col w-full max-w-6xl overflow-hidden pt-14 xs:pt-24 pb-24 xs:pb-28 sm:pb-32 gap-2 bg-spring-bud">

            {/* Botonera */}
            <section aria-labelledby="recipe-action-title" className="z-20 w-full flex text-center items-center justify-center fixed left-0 top-16 xs:top-20 py-4 bg-folly border-b-4 border-b-spring-bud h-16">
                <h2 id="recipe-actions-title" className="sr-only">
                    Botonera de acciones y navegación de la receta
                </h2>

                <div className="flex justify-between px-8 md:px-12 xl:px-14 2xl:px-16 w-full max-w-6xl">

                    {/* Navegación atrás/arriba */}
                    <nav className='flex gap-2 xs:gap-4'>
                        <MiniCircleButton
                            onClick={() => {
                                if (window.history.length > 2) navigate(-1)
                                else navigate("/home")
                            }}
                            variant="recipe" title="Atrás" aria-label="Atrás" className="pr-1"
                        >
                            <FaChevronLeft />
                        </MiniCircleButton>

                        <MiniCircleButton
                            onClick={(e: React.MouseEvent) => { window.scrollTo({ top: 0, behavior: "smooth" }); (e.currentTarget as HTMLElement).blur() }}
                            variant="recipe" title="Arriba" aria-label="Arriba"
                        >
                            <FaChevronUp />
                        </MiniCircleButton>
                    </nav>

                    {/* Acciones receta */}
                    <div className='flex gap-2 xs:gap-4' role="toolbar" aria-label="Acciones de receta">

                        {/* Favoritos */}
                        <MiniCircleButton
                            onClick={handleToggleFavoriteClick}
                            aria-label={recipe.isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
                            title={recipe.isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
                            variant="recipe"
                        >
                            <FaStar aria-hidden="true" style={{ opacity: recipe.isFavorite ? 1 : 0.3 }} />
                        </MiniCircleButton>

                        {/* Lista */}
                        <MiniCircleButton
                            onClick={() => alert('Añadir a lista: funcionalidad en el horno')}
                            aria-label="Añadir a lista"
                            title="Añadir a lista"
                            variant="recipe"
                        >
                            <FaListUl aria-hidden="true" />
                        </MiniCircleButton>

                        {/* Compartir */}
                        <MiniCircleButton
                            onClick={() => alert('Compartir: funcionalidad cociendose a fuego lento')}
                            aria-label="Compartir receta"
                            title="Compartir receta"
                            variant="recipe"
                            className="pr-1"
                        >
                            <FaShareAlt aria-hidden="true" />
                        </MiniCircleButton>

                        {/* Editar/Borrar si es propio */}
                        {recipe.own && (
                            <div className="flex pl-1 xs:pl-8 gap-2 xs:gap-4">
                                <MiniCircleButton
                                    onClick={handleEditRecipeButton}
                                    aria-label="Editar receta"
                                    title="Editar receta"
                                    variant="recipe"
                                >
                                    <MdEdit aria-hidden="true" />
                                </MiniCircleButton>

                                <MiniCircleButton
                                    onClick={handleDeleteButtonClick}
                                    aria-label="Eliminar receta"
                                    title="Eliminar receta"
                                    variant="recipe"
                                >
                                    <MdDelete aria-hidden="true" />
                                </MiniCircleButton>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* <-- recipe --> */}
            <article aria-labelledby="recipe-title" className="flex flex-col gap-3 xs:gap-4">
                <section className='flex flex-col items-center'>
                    <h2 className="sr-only">Presentación de la receta</h2>

                    {/* <-- images --> */}
                    <div className="w-full flex flex-row items-center justify-center overflow-hidden h-44 xs:h-56 sm:h-72 md:h-80 2xl:h-96 mt-16 xs:mt-12 lg:mt-0 xl:-mt-4 max-w-6xl">
                        {recipe.images.length > 0 ? (
                            recipe.images.map((image: string, index: number) => {
                                const widthClass = recipe.images.length === 1 ? "w-full" : "w-1/2"

                                return (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Recipe image ${index + 1}`}
                                        className={`h-full object-cover border-none ${widthClass}`}
                                    />
                                )
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center anybody-title text-lg md:text-xl xl:text-2xl text-canary bg-violet" role="status">
                                No hay imágenes
                            </div>
                        )}
                    </div>

                    {/* <-- title, author, date --> */}
                    <div className="
                        z-10 relative flex flex-col justify-center align-middle items-center text-center rounded-xs
                        gap-3 p-4 xs:p-6 w-3/4 sm:p-8 md:p-10 sm:w-2/3 lg:w-1/2
                        mx-16 -mt-4 sm:-mt-6 lg:-mt-8
                        bg-folly text-spring-bud
                        shadow-hard-md xs:shadow-hard-lg xl:shadow-hard-xl
                    ">
                        <h1 className="anybody-logo text-xl sm:text-2xl lg:text-3xl xl:text-4xl -mb-2 leading-tight">{recipe.title}</h1>

                        {recipe.author && <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl underline decoration-4 underline-offset-4">@{recipe.author.username}</h2>}

                        {recipe.date && <time className="text-xs sm:text-sm lg:text-base xl:text-lg">{formatDate(recipe.date)}</time>}
                    </div>

                    <div className='flex flex-col gap-3 xs:gap-4 lg:gap-6 py-6 xs:py-8 md:py-10 justify-center items-center px-8 md:px-12 xl:px-14 w-full'>
                        {/* <-- description --> */}
                        {recipe.description && <p className="text-folly text-center text-base sm:text-lg lg:text-xl xl:text-2xl leading-tight">{recipe.description}</p>}

                        {/* <-- time, difficulty, category, servings --> */}
                        {
                            (recipe.time || recipe.difficulty || recipe.category || recipe.servings) && (
                                <div className="flex flex-row flex-wrap justify-center anybody-title text-lg sm:text-xl lg:text-2xl xl:text-3xl text-folly gap-2">
                                    {Boolean(recipe.time) && <h3>{recipe.time} min</h3>}
                                    {recipe.difficulty && (
                                        <>
                                            {(Boolean(recipe.time) || recipe.category) && " · "}
                                            <h3>Dificultad: {difficultyMap[recipe.difficulty]}</h3>
                                        </>
                                    )}
                                    {recipe.category && (
                                        <>
                                            {(Boolean(recipe.time) || recipe.difficulty) && " · "}
                                            <h3>{categoryMap[recipe.category]}</h3>
                                        </>
                                    )}
                                    {recipe.servings && (
                                        <>
                                            {(Boolean(recipe.time) || recipe.difficulty || recipe.category) && " · "}
                                            <h3>
                                                <FaUtensils className="inline mr-1 align-middle" aria-hidden="true" />
                                                {recipe.servings}
                                            </h3>
                                        </>
                                    )}
                                </div>
                            )
                        }

                        {/* <-- source badge --> */}
                        {recipe.source && recipe.source !== 'manual' && (
                            <div className="anybody-title text-xs sm:text-sm lg:text-base text-spring-bud px-2 py-0.5 rounded-xs bg-folly shadow-hard-sm">
                                Fuente: {sourceMap[recipe.source] || recipe.source}
                            </div>
                        )}

                        {/* <-- views and likes counters --> */}
                        {(recipe.views !== undefined || recipe.likes !== undefined) && (
                            <div className="flex flex-row gap-4 text-folly text-sm sm:text-base">
                                {recipe.views !== undefined && (
                                    <span className="flex items-center gap-1">
                                        <FaEye className="opacity-70" aria-hidden="true" />
                                        {recipe.views}
                                    </span>
                                )}
                                {recipe.likes !== undefined && (
                                    <span className="flex items-center gap-1">
                                        <FaHeart className="opacity-70" aria-hidden="true" />
                                        {recipe.likes}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* <-- tags --> */}
                        {recipe.tags && recipe.tags.length > 0 && (
                            <ul className="flex flex-wrap justify-center gap-3 xs:gap-4 md:gap-6 text-spring-bud">
                                {recipe.tags.map((tag: string, index: number) => (
                                    <li className="rounded-xs anybody-title text-xs sm:text-sm lg:text-base xl:text-lg pb-0.5 pt-1 px-2 bg-folly shadow-hard-sm xs:shadow-hard-md" key={index}>#{tag}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                {/* <-- ingredients --> */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <section aria-labelledby='ingredients' className="flex flex-col justify-items-center items-center py-6 sm:py-8 gap-6 px-8 md:px-12 xl:px-14 w-full bg-folly">
                        <h2 id="ingredients" className="
                        anybody-logo text-2xl sm:text-3xl xl:text-4xl text-spring-bud
                        drop-shadow-hard-sm xl:drop-shadow-hard-md
                    ">Ingredientes</h2>

                        <div className="flex flex-col lg:flex-row lg:items-start justify-center gap-6 lg:gap-20 text-center">

                            {/* <-- main ingredients --> */}
                            {recipe.ingredients.some((ingredient: any) => ingredient.main) && (
                                <div className="flex flex-col items-center justify-center align-middle w-full lg:w-auto">
                                    <h3 className="
                                        inline-block px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-xs text-folly bg-spring-bud
                                        shadow-hard-md xl:shadow-hard-lg
                                    ">Principales</h3>
                                    {recipe.ingredients
                                        .filter((ingredient: any) => ingredient.main)
                                        .map((ingredient: any) => (
                                            <div className="py-1 xs:py-1.5 text-base sm:text-lg xl:text-xl leading-tight text-spring-bud" key={ingredient.id}>
                                                <p>
                                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {/* <-- pantry ingredients --> */}
                            {recipe.ingredients.some((ingredient: any) => !ingredient.main) && (
                                <div className="flex flex-col items-center justify-center align-middle w-full lg:w-auto">
                                    <h3 className="
                                        inline-block px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-xs text-folly bg-spring-bud
                                        shadow-hard-md xl:shadow-hard-lg
                                    ">Despensa</h3>
                                    {recipe.ingredients
                                        .filter((ingredient: any) => !ingredient.main)
                                        .map((ingredient: any) => (
                                            <div className="py-1 xs:py-1.5 text-base sm:text-lg xl:text-xl leading-tight text-spring-bud" key={ingredient.id}>
                                                <p>
                                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* <-- nutrition --> */}
                {recipe.nutrition && (recipe.nutrition.calories || recipe.nutrition.protein || recipe.nutrition.carbs || recipe.nutrition.fat) && (
                    <section aria-labelledby='nutrition' className="flex flex-col justify-items-center items-center py-6 sm:py-8 gap-6 px-8 md:px-12 xl:px-14 w-full bg-folly">
                        <h2 id="nutrition" className="
                        anybody-logo text-2xl sm:text-3xl xl:text-4xl text-spring-bud
                        drop-shadow-hard-sm xl:drop-shadow-hard-md
                    ">Información nutricional</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-spring-bud">
                            {recipe.nutrition.calories !== undefined && (
                                <div className="flex flex-col items-center p-4 rounded-xs bg-spring-bud text-folly shadow-hard-md">
                                    <span className="anybody-title text-lg sm:text-xl">{recipe.nutrition.calories}</span>
                                    <span className="text-sm sm:text-base">Calorías</span>
                                </div>
                            )}
                            {recipe.nutrition.protein !== undefined && (
                                <div className="flex flex-col items-center p-4 rounded-xs bg-spring-bud text-folly shadow-hard-md">
                                    <span className="anybody-title text-lg sm:text-xl">{recipe.nutrition.protein}g</span>
                                    <span className="text-sm sm:text-base">Proteínas</span>
                                </div>
                            )}
                            {recipe.nutrition.carbs !== undefined && (
                                <div className="flex flex-col items-center p-4 rounded-xs bg-spring-bud text-folly shadow-hard-md">
                                    <span className="anybody-title text-lg sm:text-xl">{recipe.nutrition.carbs}g</span>
                                    <span className="text-sm sm:text-base">Carbohidratos</span>
                                </div>
                            )}
                            {recipe.nutrition.fat !== undefined && (
                                <div className="flex flex-col items-center p-4 rounded-xs bg-spring-bud text-folly shadow-hard-md">
                                    <span className="anybody-title text-lg sm:text-xl">{recipe.nutrition.fat}g</span>
                                    <span className="text-sm sm:text-base">Grasas</span>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* <-- steps --> */}
                {recipe.steps && recipe.steps.length > 0 && (
                    <section aria-labelledby='steps' className="flex flex-col justify-items-center items-center py-6 gap-6 px-8 md:px-12 xl:px-14 w-full">
                        <h2 id="steps" className="
                        anybody-logo text-2xl sm:text-3xl xl:text-4xl text-folly
                        drop-shadow-hard-sm xl:drop-shadow-hard-md
                    ">Preparación</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 justify-items-center text-center text-spring-bud">
                            {recipe.steps.map((step: any, index: number) => (
                                <div className="
                                    rounded-xs
                                    flex flex-col p-4 xs:p-6 gap-3 w-full bg-folly 
                                    shadow-hard-md xs:shadow-hard-lg xl:shadow-hard-xl
                                " key={index}>
                                    <h3 className="anybody-logo text-lg sm:text-xl xl:text-2xl">{index + 1}</h3>
                                    <p className="text-base sm:text-lg xl:text-xl leading-tight hyphens-auto break-words">{step.text}</p>
                                    {step.note && <p className="text-sm sm:text-base italic font-light leading-tight hyphens-auto break-words">({step.note})</p>}
                                    {step.image && (
                                        <div className="w-full mt-2 sm:max-h-48 overflow-hidden bg-folly">
                                            <img
                                                src={step.image}
                                                alt={`Paso ${index + 1} image`}
                                                className="w-full h-auto sm:max-h-48 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </main>

        <Footer></Footer>
    </div >
}

export default Recipe
