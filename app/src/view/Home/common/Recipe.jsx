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

    return <div className="flex flex-col min-h-screen w-full items-center bg-hot-magenta">
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
                    z-20 w-full flex text-center items-center fixed left-0 top-16 xs:top-20
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

            {/* receta */}
            <article aria-labelledby="recipe-title">

                {/* images */}
                <section className="w-full flex flex-row items-center justify-center overflow-hidden h-44 mt-16 bg-violet">

                    <h2 className="sr-only">Imágenes de la receta</h2>

                    {recipe.images.length > 0 ? (
                        recipe.images.map((image, index) => (
                            <img key={index} src={image} alt={`Recipe image ${index + 1}`} className="w-full h-full object-cover -m-1 border-none" />
                        ))
                    ) : (
                        <div className="w-full h-full flex items-center justify-center anybody-title text-lg text-canary" role="status">No hay imágenes</div>
                    )}
                </section>

                {/* title, author, date */}
                <section className="
                    z-10 relative flex flex-col justify-center align-middle items-center text-center
                    gap-3 p-4
                    mx-10 -mt-4
                    bg-folly text-spring-bud
                    shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]
                ">
                    <h1 id="recipe-title" className="anybody-logo text-xl -mb-2 leading-tight">{recipe.title}</h1>
                    <h2 className="text-base underline decoration-4 underline-offset-4">@{author}</h2>
                    <time className="text-xs ">{formatDate(recipe.date)}</time>
                </section>

                <div className='flex flex-col gap-3 p-6 justify-center items-center'>
                    {/* description */}
                    {recipe.description && <p className="text-folly text-center text-base leading-tight">{recipe.description}</p>}

                    {/* time, difficulty */}
                    {
                        (recipe.time || recipe.difficulty) && (
                            <div className="flex flex-row anybody-title text-lg text-folly gap-2">
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
                        <div className="flex flex-wrap justify-center gap-3 text-spring-bud">
                            {recipe.tags.map((tag, index) => (
                                <h3 className="anybody-title text-xs pb-0.5 pt-1 px-2 bg-folly shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]" key={index}>#{tag}</h3>
                            ))}
                        </div>
                    )}
                </div>

                {/* ingredients */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <section className="flex flex-col justify-items-center items-center py-[4vw] xl:py-[1vw] w-full bg-folly">
                        <h2 className="
                        mt-[2vw] anybody-logo text-[7vw] md:text-[6vw] xl:text-[2.5vw] text-spring-bud
                        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.9vw_0.9vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                    ">Ingredientes</h2>

                        <div className="flex flex-col text-center px-[8vw] xl:px-[3vw] gap-[3vw] xl:gap-[1vw]">
                            {/* Ingredientes principales */}
                            {recipe.ingredients.some(ingredient => ingredient.main) && (
                                <>
                                    <h3 className="
                                    text-center mt-[5vw] xl:mt-[3vw] mb-[2vw] xl:mb-[1vw] w-[30vw] sm:w-[25vw] xl:w-[9vw] mx-auto py-[0.5vw] xl:py-[0.1vw]
                                    anybody-title text-[5vw] sm:text-[4vw] xl:text-[1.4vw] text-folly bg-spring-bud
                                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                                ">Principales</h3>
                                    {recipe.ingredients
                                        .filter(ingredient => ingredient.main)
                                        .map((ingredient) => (
                                            <div className="anybody text-[5vw] sm:text-[4vw] md:text-[3.5vw] xl:text-[1.4vw] leading-[120%] text-spring-bud" key={ingredient.id}>
                                                <p>
                                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                                </p>
                                            </div>
                                        ))}
                                </>
                            )}

                            {/* Ingredientes de despensa */}
                            {recipe.ingredients.some(ingredient => !ingredient.main) && (
                                <>
                                    <h3 className="
                                    text-center mt-[5vw] xl:mt-[2vw] mb-[2vw] xl:mb-[1vw] w-[30vw] sm:w-[25vw] xl:w-[9vw] mx-auto py-[0.5vw] xl:py-[0.1vw]
                                    anybody-title text-[5vw] sm:text-[4vw] xl:text-[1.4vw] text-folly bg-spring-bud
                                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                                ">Despensa</h3>
                                    {recipe.ingredients
                                        .filter(ingredient => !ingredient.main)
                                        .map((ingredient) => (
                                            <div className="anybody text-[5vw] sm:text-[4vw] md:text-[3.5vw] xl:text-[1.4vw] leading-[120%] text-spring-bud" key={ingredient.id}>
                                                <p>
                                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                                </p>
                                            </div>
                                        ))}
                                </>
                            )}
                        </div>
                    </section>
                )}

                {/* steps */}
                {recipe.steps && recipe.steps.length > 0 && (
                    <section className="flex flex-col justify-items-center items-center py-[6vw] xl:py-[4vw] -my-1 w-full bg-folly border-transparent">
                        <h2 className="
                        anybody-logo text-[7vw] md:text-[6vw] xl:text-[2.5vw] text-spring-bud
                        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.9vw_0.9vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                    ">Preparación</h2>

                        <div className="mt-[4vw] xl:mt-[2vw] text-center w-[85vw] xl:w-[28vw] flex flex-col gap-[6vw] xl:gap-[2vw] text-folly">
                            {recipe.steps.map((step, index) => (
                                <div className="
                                flex flex-col gap-[2vw] xl:gap-[0.8vw] px-[5vw] py-[6vw] xl:py-[2vw] bg-spring-bud
                                drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                            " key={index}>
                                    <h3 className="anybody-logo text-[6vw] sm:text-[5vw] md:text-[4.5vw] xl:text-[1.6vw] leading-[100%]">{index + 1}</h3>
                                    <p className="anybody text-[5vw] sm:text-[4vw] md:text-[3.5vw] xl:text-[1.2vw] leading-[120%]">{step.text}</p>
                                    {step.note && <p className="anybody text-[4vw] sm:text-[3vw] xl:text-[1vw] italic font-light leading-[120%]">({step.note})</p>}
                                    {step.image && (
                                        <img
                                            src={step.image}
                                            alt={`Paso ${index + 1} image`}
                                            className="w-full mt-[2vw] xl:mt-[1vw]"
                                        />
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