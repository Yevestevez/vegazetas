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

function Recipe({
    onUserLoggedOut,
    onLogoClicked,
    onEditRecipeClicked,
    onRecipeDeleted,
    onRecipeBackButtonClicked
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

    const handleLogoLinkCLick = () => onLogoClicked()

    const handleRecipeBackButton = (event) => {
        event.preventDefault()

        onRecipeBackButtonClicked()
    }

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

    const btnClass = `
      rounded-full flex items-center justify-center
      h-[12vw] sm:h-[9vw] md:h-[8vw] lg:h-[7vw] xl:h-[3.5vw]
      w-[12vw] sm:w-[9vw] md:w-[8vw] lg:w-[7vw] xl:w-[3.5vw]
      bg-sgbus-green text-veronica
      hover:bg-veronica hover:text-sgbus-green hover:outline-[0.1em] hover:outline-sgbus-green
      text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[5vw] xl:text-[2.5vw]
      drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
      sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
      lg:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
      xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
      transition-all duration-100 ease-out
      hover:-translate-y-1 hover:scale-105
    `

    return <article className="flex flex-col min-h-screen w-full items-center xl:items-start pt-[21vw] sm:pt-[17vw] md:pt-[16vw] xl:pt-[0] overflow-hidden bg-hot-magenta">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <main className="flex flex-col xl:ml-[40vw] w-full xl:w-[35vw] mb-[30vw] sm:mb-[20vw] lg:mb-[16vw] xl:mb-[4vw] bg-aquamarine">
            {/* images */}
            <div className="w-full flex flex-row items-center justify-center overflow-hidden h-[60vw] xl:h-[20vw] bg-violet">
                {recipe.images.length > 0 ? (
                    recipe.images.map((image, index) => (
                        <img key={index} src={image} alt={`Recipe image ${index + 1}`} className="w-full h-full object-cover -m-[1px] border-none" />
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center anybody-title text-[6vw] xl:text-[2vw] text-white">No hay imágenes</div>
                )}
            </div>

            {/* title, author, date */}
            <div className="
                flex flex-col justify-center align-middle items-center text-center mx-auto h-auto gap-[1.5vw] xl:gap-[1vw] bg-canary text-coquelicot

                w-[80vw] xl:w-[28vw]
                p-[6vw] xl:p-[2vw]
                -mt-[6vw] xl:-mt-[2vw] mb-[5vw] xl:mb-[0vw]

                drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
            ">
                <h2 className="anybody-logo text-[6vw]/[120%] xl:text-[1.8vw]/[120%]">{recipe.title}</h2>
                <h3 className="mb-[4vw] xl:mb-[1vw] anybody underline decoration-[0.4em] underline-offset-[0.4em] text-[4vw] xl:text-[1.4vw]">@{author}</h3>
                <time className="anybody text-[3vw] xl:text-[1vw] -mb-[0.5vw]">{formatDate(recipe.date)}</time>
            </div>

            <div>
                {/* description */}
                {recipe.description && <p className="py-[4vw] xl:py-[2vw] xl:pt-[3vw] w-[80vw] xl:w-[28vw] justify-center mx-auto text-center anybody text-[4vw]/[120%] xl:text-[1.4vw]/[120%] text-violet">{recipe.description}</p>}

                {/* time, difficulty */}
                {
                    (recipe.time || recipe.difficulty) && (
                        <div className="flex flex-row gap-[2vw] xl:gap-[1vw] justify-center py-[2vw] xl:py-[0.5vw] anybody-title text-[5vw] xl:text-[1.8vw] text-violet">
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
                    <div className="
                        flex flex-wrap mx-[20vw] xl:mx-[2vw] pt-[2vw] pb-[8vw] xl:pb-[4vw] gap-[4vw] xl:gap-[1.5vw] justify-center text-spring-bud
                        drop-shadow-[1.3vw_1.3vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.5vw_0.5vw_0_rgba(0,0,0,0.8)]
                    ">
                        {recipe.tags.map((tag, index) => (
                            <h3 className="py-[0.5vw] xl:py-[0.1vw] px-[1.8vw] anybody-title text-[3vw] xl:text-[1.2vw] bg-folly" key={index}>#{tag}</h3>
                        ))}
                    </div>
                )}
            </div>

            {/* ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div className="flex flex-col justify-items-center items-center py-[4vw] xl:py-[1vw] w-full bg-hot-magenta">
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
                                    anybody-title text-[5vw] sm:text-[4vw] xl:text-[1.4vw] text-hot-magenta bg-spring-bud
                                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                                ">Principales</h3>
                                {recipe.ingredients
                                    .filter(ingredient => ingredient.main)
                                    .map((ingredient) => (
                                        <div className="anybody text-[5vw]/[120%] sm:text-[4vw]/[120%] md:text-[3.5vw]/[120%] xl:text-[1.4vw]/[120%] text-spring-bud" key={ingredient.id}>
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
                                    anybody-title text-[5vw] sm:text-[4vw] xl:text-[1.4vw] text-hot-magenta bg-spring-bud
                                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                                ">Despensa</h3>
                                {recipe.ingredients
                                    .filter(ingredient => !ingredient.main)
                                    .map((ingredient) => (
                                        <div className="anybody text-[5vw]/[120%] sm:text-[4vw]/[120%] md:text-[3.5vw]/[120%] xl:text-[1.4vw]/[120%] text-spring-bud" key={ingredient.id}>
                                            <p>
                                                <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                            </p>
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* steps */}
            {recipe.steps && recipe.steps.length > 0 && (
                <div className="flex flex-col justify-items-center items-center py-[6vw] xl:py-[4vw] -my-1 w-full bg-hot-magenta border-transparent">
                    <h2 className="
                        anybody-logo text-[7vw] md:text-[6vw] xl:text-[2.5vw] text-spring-bud
                        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.9vw_0.9vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                    ">Preparación</h2>

                    <div className="mt-[4vw] xl:mt-[2vw] text-center w-[85vw] xl:w-[28vw] flex flex-col gap-[6vw] xl:gap-[2vw] text-hot-magenta">
                        {recipe.steps.map((step, index) => (
                            <div className="
                                flex flex-col gap-[2vw] xl:gap-[0.8vw] px-[5vw] py-[6vw] xl:py-[2vw] bg-spring-bud
                                drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                            " key={index}>
                                <h3 className="anybody-logo text-[6vw]/[100%] sm:text-[5vw]/[100%] md:text-[4.5vw]/[100%] xl:text-[1.6vw]/[100%]">{index + 1}</h3>
                                <p className="anybody text-[5vw]/[120%] sm:text-[4vw]/[120%] md:text-[3.5vw]/[120%] xl:text-[1.2vw]/[120%]">{step.text}</p>
                                {step.note && <p className="anybody text-[4vw]/[120%] sm:text-[3vw]/[120%] xl:text-[1vw]/[120%] italic font-light">({step.note})</p>}
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
                </div>
            )}
        </main>

        {/* buttons */}
        <div className="
            fixed bottom-0 left-0 overflow-hidden flex xl:justify-end bg-veronica
            w-full xl:w-[40vw] xl:h-[55vh] px-[8vw] xl:px-0 -mb-[1px] xl:-mb-0  py-[5vw] sm:py-[3vw] xl:py-0
        ">
            <div className="flex flex-row xl:flex-col justify-between xl:justify-center items-center xl:gap-[2vw] w-full xl:w-[20vw] h-full xl:pb-[2vw]">
                <div className="flex flex-row xl:flex-col gap-[4vw] xl:gap-[2vw]">
                    <button className={`${btnClass} pr-[0.15em]`} onClick={handleRecipeBackButton}><FaChevronLeft /></button>
                    <button className={`${btnClass} pb-[0.05em]`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><FaChevronUp /></button>
                </div>
                <div className="flex flex-row xl:flex-col gap-[4vw] xl:gap-[2vw]">
                    <button className={btnClass} type="button" onClick={handleEditRecipeButton} aria-label="Editar receta"><MdEdit /></button>
                    <button className={btnClass} type="button" onClick={handleDeleteButtonClick} aria-label="Eliminar receta"><MdDelete /></button>
                </div>
            </div>
        </div>
    </article>
}

export default Recipe