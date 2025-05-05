import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

import { FaChevronUp } from "react-icons/fa"
import { FaChevronLeft } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { MdEdit } from "react-icons/md"

import logic from '../../../logic'
import formatDate from '../../helper/formatDate'
import Header from '../common/Header'

import { useAppContext } from '../../../context'

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

    console.log('Recipe -> render')

    return <article className="
        /* Layout */
        flex flex-col min-h-screen min-w-screen items-center
        pt-23

        /* Colores */
        bg-aquamarine
    ">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        {/* images */}
        <div className="
            /* Layout */
            h-[60vw] sm:h-[70vw] w-full flex flex-row items-center justify-center

            /* Colores */
            bg-violet
        ">
            {recipe.images.length > 0 ? (
                recipe.images.map((image, index) => (
                    <img key={index} src={image} alt={`Recipe image ${index + 1}`} className="
                        /* Layout */
                        w-full h-full object-cover -m-1

                        /* Bordes */
                        border-transparent
                    " />
                ))
            ) : (
                <div className="
                    /* Layout */
                    w-full h-full flex items-center justify-center

                    /* Tipografía */
                    anybody-title text-[6vw] text-white
                ">No hay imágenes</div>
            )}
        </div>

        {/* title, author, date */}
        <div className="
            /* Layout */
            p-[6vw] gap-2 mx-auto -mt-[6vw] mb-[5vw] flex flex-col justify-center align-middle items-center text-center
            h-auto w-[80vw]

            /* Colores */
            bg-sgbus-green text-canary

            /* Sombra */
            drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]
            sm:drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
        ">
            <h2 className="
                /* Tipografía */
                anybody-logo text-[6vw]/[120%]
            ">{recipe.title}</h2>
            <h3 className="
                /* Layout */
                mb-[4vw]

                /* Tipografía */
                anybody text-[4vw] underline decoration-[0.4em] underline-offset-[0.4em]
            ">@{author}</h3>
            <time className="
                /* Tipografía */
                anybody text-[3vw] -mb-[1vw]
            ">{formatDate(recipe.date)}</time>
        </div>

        {/* description */}
        {recipe.description && <p className="
            /* Layout */
            py-[4vw] w-[80vw] justify-center mx-auto text-center

            /* Tipografía */
            anybody text-[4vw]/[120%] text-violet
        ">{recipe.description}</p>}

        {/* time, difficulty */}
        {
            (recipe.time || recipe.difficulty) && (
                <div className="
                    /* Layout */
                    flex flex-row gap-2 justify-center py-[2vw]

                    /* Tipografía */
                    anybody-title text-[5vw] text-violet
                ">
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
                /* Layout */
                flex flex-wrap mx-[20vw] pt-[2vw] pb-[8vw] gap-5 justify-center

                /* Colores */
                text-spring-bud

                /* Sombra */
                drop-shadow-[1.3vw_1.3vw_0_rgba(0,0,0,0.8)]
                sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
            ">
                {recipe.tags.map((tag, index) => (
                    <h3 className="
                        /* Layout */
                        py-[0.5vw] px-[1.8vw]

                        /* Tipografía */
                        anybody-title text-[3vw]

                        /* Colores */
                        bg-folly
                    " key={index}>#{tag}</h3>
                ))}
            </div>
        )}

        {/* ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="
                /* Layout */
                flex flex-col justify-items-center items-center py-[4vw] w-full

                /* Colores */
                bg-hot-magenta
            ">
                <h2 className="
                    /* Layout */
                    mt-[2vw]

                    /* Tipografía */
                    anybody-logo text-[7vw] text-spring-bud

                    /* Sombra */
                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[0.9vw_0.9vw_0_rgba(0,0,0,0.8)]
                ">Ingredientes</h2>

                {/* Separación de ingredientes */}
                <div className="
                    /* Layout */
                    flex flex-col text-center px-[8vw] gap-4
                ">
                    {/* Ingredientes principales */}
                    {recipe.ingredients.some(ingredient => ingredient.main) && (
                        <>
                            <h3 className="
                                /* Layout */
                                text-center mt-[5vw] mb-[2vw] w-[30vw] mx-auto

                                /* Tipografía */
                                anybody-title text-[5vw] text-hot-magenta

                                /* Colores */
                                bg-spring-bud

                                /* Sombra */
                                drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                            ">Principales</h3>
                            {recipe.ingredients
                                .filter(ingredient => ingredient.main)
                                .map((ingredient) => (
                                    <div className="
                                        /* Tipografía */
                                        anybody text-[5vw]/[120%] sm:text-[4vw]/[120%] text-spring-bud
                                    " key={ingredient.id}>
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
                                /* Layout */
                                text-center mt-[5vw] mb-[2vw] w-[30vw] mx-auto

                                /* Tipografía */
                                anybody-title text-[5vw] text-hot-magenta

                                /* Colores */
                                bg-spring-bud

                                /* Sombra */
                                drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                            ">Despensa</h3>
                            {recipe.ingredients
                                .filter(ingredient => !ingredient.main)
                                .map((ingredient) => (
                                    <div className="
                                        /* Tipografía */
                                        anybody text-[5vw]/[120%] sm:text-[4vw]/[120%] text-spring-bud
                                    " key={ingredient.id}>
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
            <div className="
                /* Layout */
                flex flex-col justify-items-center items-center py-[6vw] -mt-1 w-full
               
                /* Colores */
                bg-hot-magenta

                /* Bordes */
                border-transparent
            ">
                <h2 className="
                    /* Layout */
                    mt-[2vw]

                    /* Tipografía */
                    anybody-logo text-[7vw] text-spring-bud

                    /* Sombra */
                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[0.9vw_0.9vw_0_rgba(0,0,0,0.8)]
                ">Preparación</h2>

                <div className="
                    /* Layout */
                    mt-5 text-center w-[85vw] flex flex-col gap-8

                    /* Colores */
                    text-hot-magenta
                ">
                    {recipe.steps.map((step, index) => (
                        <div className="
                            /* Layout */
                            flex flex-col gap-3 px-[5vw] py-[6vw]

                            /* Colores */
                            bg-spring-bud

                            /* Sombra */
                            drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]
                            sm:drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
                        " key={index}>
                            <h3 className="
                                /* Tipografía */
                                anybody-logo text-[6vw]/[100%] sm:text-[5vw]/[100%]
                            ">{index + 1}</h3>
                            <p className="
                                /* Tipografía */
                                anybody text-[5vw]/[120%] sm:text-[4vw]/[120%]
                            ">{step.text}</p>
                            {step.note && <p className="
                                /* Tipografía */
                                anybody text-[4vw]/[120%] sm:text-[3vw]/[120%] 
                                italic font-light
                            ">({step.note})</p>}
                            {step.image && (
                                <img
                                    src={step.image}
                                    alt={`Paso ${index + 1} image`}
                                    className="
                                        /* Layout */
                                        w-full mt-[2vw]
                                    "
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* buttons */}
        <div className="
            /* Layout */
            flex flex-row gap-8 pt-[5vw] pb-[10vw] -mt-1 w-full px-[8vw] justify-between

            /* Colores */
            bg-hot-magenta
        ">
            <div className="flex flex-row gap-5 sm:gap-8">
                <button
                    className="
                    /* Layout */
                    h-[12vw] w-[12vw] rounded-full flex items-center justify-center  pr-[0.15em]

                    /* Colores */
                    bg-spring-bud text-hot-magenta
                    hover:bg-hot-magenta hover:text-spring-bud
                    hover:outline hover:outline-[0.1em] hover:outline-spring-bud

                    /* Tipografía */
                    text-[8vw]

                    /* Sombra */
                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

                    /* Transiciones */
                    transition-all duration-100 ease-out
                    hover:-translate-y-1 hover:scale-105
                    "
                    onClick={handleRecipeBackButton}
                >
                    <FaChevronLeft />
                </button>

                <button
                    className="
                    /* Layout */
                    h-[12vw] w-[12vw] rounded-full flex items-center justify-center pb-[0.05em]

                    /* Colores */
                    bg-spring-bud text-hot-magenta
                    hover:bg-hot-magenta hover:text-spring-bud
                    hover:outline hover:outline-[0.1em] hover:outline-spring-bud

                    /* Tipografía */
                    text-[8vw]

                    /* Sombra */
                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

                    /* Transiciones */
                    transition-all duration-100 ease-out
                    hover:-translate-y-1 hover:scale-105
                    "
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <FaChevronUp />
                </button>
            </div>
            <div className="flex flex-row gap-5 sm:gap-8">
                <button className="
                    /* Layout */
                    h-[12vw] w-[12vw] rounded-full flex items-center justify-center

                    /* Colores */
                    bg-spring-bud text-hot-magenta
                    hover:bg-hot-magenta hover:text-spring-bud
                    hover:outline hover:outline-[0.1em] hover:outline-spring-bud

                    /* Tipografía */
                    text-[8vw]

                    /* Sombra */
                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

                    /* Transiciones */
                    transition-all duration-100 ease-out
                    hover:-translate-y-1 hover:scale-105
                " type="button" onClick={handleEditRecipeButton}><MdEdit /></button>

                <button className="
                    /* Layout */
                    h-[12vw] w-[12vw] rounded-full flex items-center justify-center

                    /* Colores */
                    bg-spring-bud text-hot-magenta
                    hover:bg-hot-magenta hover:text-spring-bud
                    hover:outline hover:outline-[0.1em] hover:outline-spring-bud

                    /* Tipografía */
                    text-[8vw]

                    /* Sombra */
                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

                    /* Transiciones */
                    transition-all duration-100 ease-out
                    hover:-translate-y-1 hover:scale-105
                " type="button" onClick={handleDeleteButtonClick}><MdDelete /></button>
            </div>
        </div>
    </article>
}

export default Recipe