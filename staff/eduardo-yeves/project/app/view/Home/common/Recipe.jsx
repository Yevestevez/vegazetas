// import { useAppContext } from '../../context'
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

import { FaChevronCircleUp } from "react-icons/fa"
import { FaChevronCircleLeft } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { MdEdit } from "react-icons/md"

import logic from '../../../logic'
import formatDate from '../../helper/formatDate'
import Header from '../common/Header'

function Recipe({
    onUserLoggedOut,
    onLogoClicked,
    onEditRecipeClicked,
    onRecipeDeleted,
    onRecipeBackButtonClicked
}) {
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
        if (window.confirm('Delete recipe?')) {
            logic.deleteRecipe(recipe.id)
                .then(() => onRecipeDeleted())
                .catch(error => {
                    alert(error.message)
                    console.error(error)
                })
        }
    }

    const difficultyMap = {
        easy: "Fácil",
        medium: "Media",
        difficult: "Difícil"
    }

    if (!recipe) return <p>Cargando receta...</p>

    console.log('Recipe -> render')

    return <article className="pt-23 bg-aquamarine h-full w-screen">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        {/* images */}
        <div className={`h-75 w-full flex flex-row items-center justify-center ${recipe.images.length === 0 ? 'bg-violet' : ''}`}>
            {recipe.images.length > 0 ? (
                recipe.images.map((image, index) => (
                    <img key={index} src={image} alt={`Recipe image ${index + 1}`} className="w-full h-full object-cover border-transparent -m-1" />
                ))
            ) : (
                <div className="anybody-title text-[5vw] w-full h-full flex items-center justify-center text-white text-lg">No hay imágenes</div>
            )}
        </div>

        {/* title, author, date */}
        <div className="p-8 gap-1 mx-auto -mt-8 mb-5 flex flex-col justify-center align-middle items-center text-center text-canary bg-sgbus-green h-auto w-80 drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]">
            <h2 className="anybody-logo text-[6vw]/[120%]">{recipe.title}</h2>
            <h3 className=" mb-4 anybody text-[4vw] underline decoration-[0.5em]">@{author}</h3>
            <time className="anybody text-[3vw]">{formatDate(recipe.date)}</time>
        </div>

        {/* description */}
        {recipe.description && <p className="py-3 anybody text-violet text-[4vw]/[120%] w-80 justify-center mx-auto text-center">{recipe.description}</p>}

        {/* time, difficulty */}
        {
            (recipe.time || recipe.difficulty) && (
                <div className="anybody-title text-violet text-[5vw] flex flex-row gap-2 justify-center py-3">
                    {recipe.time && <h3>{recipe.time} min</h3>}
                    {recipe.difficulty && (
                        <>
                            {recipe.time && " · "}
                            <h3>{difficultyMap[recipe.difficulty]}</h3>
                        </>
                    )}
                </div>
            )
        }

        {/* tags */}
        {recipe.tags && recipe.tags.length > 0 && (<div className=" text-spring-bud flex flex-wrap mx-10 pt-3 pb-8 drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] gap-5 justify-center">{recipe.tags.map((tag, index) => (
            <h3 className="bg-folly anybody-title py-0.5 px-2 text-[3vw]" key={index}>#{tag}</h3>
        ))}
        </div>)
        }

        {/* ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="flex flex-col justify-items-center items-center py-5 bg-hot-magenta">
                <h2 className="mt-2 anybody-logo text-spring-bud text-[7vw] drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]">Ingredientes</h2>
                <div className="text-spring-bud text-center mt-5 px-5">
                    {recipe.ingredients.map((ingredient) => (
                        <div className="anybody text-[5vw]/[120%] my-4" key={ingredient.id}>
                            <p>
                                <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                {ingredient.annotation && <span className="italic">({ingredient.annotation})</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* steps */}
        {recipe.steps && recipe.steps.length > 0 && (
            <div className="flex flex-col justify-items-center items-center py-5 bg-hot-magenta border-transparent -mt-1">
                <h2 className="anybody-logo text-spring-bud text-[7vw] drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]">Preparación</h2>

                <div className="text-hot-magenta mt-5 text-center w-90 flex flex-col gap-8">
                    {console.log('Pasos disponibles', recipe.steps)}  {/* Añade este log */}
                    {recipe.steps.map((step, index) => (
                        <div className="flex flex-col gap-5 p-5 bg-spring-bud drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]" key={index}>
                            <h3 className="anybody-logo text-[6vw]/[120%]">{index + 1}</h3>
                            <p className="anybody text-[5vw]/[120%]">{step.text}</p>
                            {step.note && <p className="anybody text-[4vw]/[120%] italic">({step.note})</p>}
                            {step.image && (
                                <img
                                    src={step.image}
                                    alt={`Paso ${index + 1} image`}
                                    className="w-full"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* buttons */}
        <div className="flex flex-row gap-8 pt-5 pb-10 -mt-1 w-full px-10 justify-between bg-hot-magenta">
            <div className="flex flex-row gap-5">
                <button
                    className="bg-hot-magenta text-aquamarine text-[12vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12"
                    onClick={handleRecipeBackButton}
                >
                    <FaChevronCircleLeft />
                </button>

                <button
                    className="bg-hot-magenta text-aquamarine text-[12vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <FaChevronCircleUp />
                </button>
            </div>
            <div className="flex flex-row gap-5">
                <button className="bg-aquamarine text-hot-magenta text-[8vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12 flex items-center justify-center" type="button" onClick={handleEditRecipeButton}><MdEdit /></button>

                <button className="bg-aquamarine text-hot-magenta text-[8vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12 flex items-center justify-center" type="button" onClick={handleDeleteButtonClick}><MdDelete /></button>
            </div>
        </div>

    </article >
}

export default Recipe