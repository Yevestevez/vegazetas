import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

import { FaChevronUp } from "react-icons/fa"
import { FaChevronLeft } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { MdEdit } from "react-icons/md"

import logic from '../../../logic'
import { useAppContext } from '../../../context'
import formatDate from '../../helper/formatDate'

import Header from '../common/Header'
import MiniCircleButton from './MiniCircleButton'
import Footer from '../../common/Footer'

function Recipe({
    onUserLoggedOut,
    onEditRecipeClicked,
    onRecipeDeleted,
}) {
    const { alert, confirm } = useAppContext()

    const { id: recipeId } = useParams()

    const [recipe, setRecipe] = useState(null)
    const [author, setAuthor] = useState(null)

    useEffect(() => {
        if (!recipeId) return

        logic.getRecipeById(recipeId)
            .then(recipe => {
                setRecipe(recipe)
                return recipe.author
            })
            .then(authorId => {
                logic.getUserUsername(authorId)
                    .then(username => setAuthor(username))
                    .catch(error => {
                        alert('Error al obtener el autor')

                        console.error(error)
                    })
            })
            .catch(error => {
                alert('Error al cargar la receta')

                console.error(error)
            })
    }, [recipeId])

    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleEditRecipeButton = (event) => {
        event.preventDefault()

        onEditRecipeClicked(recipeId)
    }

    const handleDeleteButtonClick = () => {
        confirm('¿Quieres borrar esta receta?', accepted => {
            if (accepted) {
                try {
                    logic.deleteRecipe(recipe.id)
                        .then(() => onRecipeDeleted())
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert(error.message)

                    console.error(error)
                }
            }
        })
    }

    const difficultyMap = {
        easy: "fácil",
        medium: "media",
        difficult: "difícil"
    }

    if (!recipe) return <p>Cargando receta...</p>

    return <div className="flex flex-col min-h-screen w-full items-center bg-spring-bud">
        <Header
            variant="recipe"
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="flex flex-col w-full max-w-7xl overflow-hidden
        pt-14 xs:pt-24 lg:pt-36 xl:pt-40
        pb-24 xs:pb-28 sm:pb-32
        gap-2 bg-spring-bud">

            {/* <-- button group --> */}
            <section
                aria-labelledby="recipe-action-title"
                className="
                    z-20 w-full flex text-center items-center justify-center fixed left-0 top-16 xs:top-20
                    py-4
                    bg-folly
                    border-b-4 border-b-spring-bud
                    h-16
                ">
                <h2 id="recipe-actions-title" className="sr-only">
                    Botonera de acciones y navegación de la receta
                </h2>

                <div className="flex justify-between px-8 md:px-12 xl:px-14 w-full max-w-7xl">
                    <nav className='flex gap-3 xs:gap-4'>
                        <MiniCircleButton to="/my-recipes" variant="recipe" title="Atrás" className="pr-1">
                            <FaChevronLeft />
                        </MiniCircleButton>

                        <MiniCircleButton onClick={(e) => {
                            window.scrollTo({ top: 0, behavior: "smooth" })
                            e.currentTarget.blur()
                        }} variant="recipe">
                            <FaChevronUp />
                        </MiniCircleButton>
                    </nav>

                    <div className='flex gap-3 xs:gap-4' role="toolbar" aria-label="Acciones de receta">
                        <MiniCircleButton onClick={handleEditRecipeButton} aria-label="Editar receta" variant="recipe">
                            <MdEdit />
                        </MiniCircleButton>

                        <MiniCircleButton onClick={handleDeleteButtonClick} aria-label="Eliminar receta" variant="recipe">
                            <MdDelete />
                        </MiniCircleButton>
                    </div>
                </div>
            </section>

            {/* recipe */}
            <article aria-labelledby="recipe-title" className="flex flex-col gap-3 xs:gap-4">
                <section className='flex flex-col items-center'>
                    <h2 className="sr-only">Presentación de la receta</h2>

                    {/* images */}
                    <div className="w-full flex flex-row items-center justify-center overflow-hidden h-44 xs:h-56 sm:h-72 md:h-80 mt-16 xs:mt-12 lg:mt-0 xl:-mt-4 max-w-7xl">
                        {recipe.images.length > 0 ? (
                            recipe.images.map((image, index) => (
                                <img key={index} src={image} alt={`Recipe image ${index + 1}`} className="w-full h-full object-cover -m-1 border-none" />
                            ))
                        ) : (
                            <div className="w-full h-full flex items-center justify-center anybody-title text-lg md:text-xl xl:text-2xl text-canary bg-violet" role="status">No hay imágenes</div>
                        )}
                    </div>

                    {/* title, author, date */}
                    <div className="
                        z-10 relative flex flex-col justify-center align-middle items-center text-center
                        gap-3 p-4 xs:p-6 w-3/4 sm:p-8 md:p-10 sm:w-2/3 lg:w-1/2
                        mx-16 -mt-4 sm:-mt-6 lg:-mt-8
                        bg-folly text-spring-bud
                        shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.5rem_0.5rem_0_0_rgba(0,0,0,0.8)]
                    ">
                        <h1 className="anybody-logo text-xl sm:text-2xl lg:text-3xl xl:text-4xl -mb-2 leading-tight sm:leading-tight lg:leading-tight xl:leading-tight">{recipe.title}</h1>
                        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl underline decoration-4 underline-offset-4">@{author}</h2>
                        <time className="text-xs sm:text-sm lg:text-base xl:text-lg">{formatDate(recipe.date)}</time>
                    </div>

                    <div className='flex flex-col gap-3 xs:gap-4 lg:gap-6 py-6 xs:py-8 md:py-10 justify-center items-center px-8 md:px-12 xl:px-14 w-full'>
                        {/* description */}
                        {recipe.description && <p className="text-folly text-center text-base sm:text-lg lg:text-xl xl:text-2xl leading-tight sm:leading-tight lg:leading-tight xl:leading-tight">{recipe.description}</p>}

                        {/* time, difficulty */}
                        {
                            (recipe.time || recipe.difficulty) && (
                                <div className="flex flex-row anybody-title text-lg sm:text-xl lg:text-2xl xl:text-3xl text-folly gap-2">
                                    {recipe.time && <h3>{recipe.time} min</h3>}
                                    {recipe.difficulty && (
                                        <>
                                            {recipe.time && " · "}
                                            <h3>Dificultad: {difficultyMap[recipe.difficulty]}</h3>
                                        </>
                                    )}
                                </div>
                            )
                        }

                        {/* tags */}
                        {recipe.tags && recipe.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-3 xs:gap-4 md:gap-6 text-spring-bud">
                                {recipe.tags.map((tag, index) => (
                                    <h3 className="anybody-title text-xs sm:text-sm lg:text-base xl:text-lg pb-0.5 pt-1 px-2 bg-folly shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]" key={index}>#{tag}</h3>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ingredients */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <section aria-labelledby='ingredients' className="flex flex-col justify-items-center items-center py-6 sm:py-8 gap-6 px-8 md:px-12 xl:px-14 w-full bg-folly">
                        <h2 id="ingredients" className="
                        anybody-logo text-2xl sm:text-3xl xl:text-4xl text-spring-bud
                        drop-shadow-[0.2rem_0.2rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)]
                    ">Ingredientes</h2>

                        <div className="columns-1 lg:columns-2 gap-6 text-center space-y-6">
                            {/* Ingredientes principales */}
                            {recipe.ingredients.some(ingredient => ingredient.main) && (
                                <div className="flex flex-col items-center justify-center align-middle">
                                    <h3 className="
                                        px-4 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl text-folly bg-spring-bud
                                        shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]
                                    ">Principales</h3>
                                    {recipe.ingredients
                                        .filter(ingredient => ingredient.main)
                                        .map((ingredient) => (
                                            <div className="py-1 xs:py-1.5 text-base sm:text-lg xl:text-xl leading-tight sm:leading-tight xl:leading-tight text-spring-bud" key={ingredient.id}>
                                                <p>
                                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {/* Ingredientes de despensa */}
                            {recipe.ingredients.some(ingredient => !ingredient.main) && (
                                <div className="flex flex-col items-center justify-center align-middle">
                                    <h3 className="
                                        px-4 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl text-folly bg-spring-bud
                                        shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]
                                    ">Despensa</h3>
                                    {recipe.ingredients
                                        .filter(ingredient => !ingredient.main)
                                        .map((ingredient) => (
                                            <div className="py-1 xs:py-1.5 text-base sm:text-lg xl:text-xl leading-tight sm:leading-tight xl:leading-tight text-spring-bud" key={ingredient.id}>
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

                {/* steps */}
                {recipe.steps && recipe.steps.length > 0 && (
                    <section aria-labelledby='steps' className="flex flex-col justify-items-center items-center py-6 gap-6 px-8 md:px-12 xl:px-14 w-full">
                        <h2 id="steps" className="
                        anybody-logo text-2xl sm:text-3xl xl:text-4xl text-folly
                        drop-shadow-[0.2rem_0.2rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)]
                    ">Preparación</h2>

                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 xs:gap-8 space-y-6 items-center justify-center text-center text-spring-bud">
                            {recipe.steps.map((step, index) => (
                                <div className="
                                    break-inside-avoid
                                    flex flex-col h-full p-4 xs:p-6 gap-3 w-full bg-folly 
                                    shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.5rem_0.5rem_0_0_rgba(0,0,0,0.8)]
                                " key={index}>
                                    <h3 className="anybody-logo text-lg sm:text-xl xl:text-2xl">{index + 1}</h3>
                                    <p className="text-base sm:text-lg xl:text-xl leading-tight sm:leading-tight xl:leading-tight">{step.text}</p>
                                    {step.note && <p className="text-sm sm:text-base italic font-light leading-tight sm:leading-tight">({step.note})</p>}
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