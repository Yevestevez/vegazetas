// import { useAppContext } from '../../context'
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

import { FaShareAlt } from "react-icons/fa"
import { FaListUl } from "react-icons/fa6"
import { FaChevronCircleUp } from "react-icons/fa"
import { FaChevronCircleLeft } from "react-icons/fa"

import logic from '../../../logic'
import formatDate from '../../helper/formatDate'
import Header from '../common/Header'

function Recipe({ onUserLoggedOut, onLogoClicked, onEditRecipeClicked }) {
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
    const handleEditRecipeButton = (event) => {
        event.preventDefault()

        onEditRecipeClicked(recipe.id)
    }

    console.log('Recipe -> render')
    console.log('Recipe ID:', recipeId)
    console.log(recipe)

    if (!recipe) return <p>Cargando receta...</p>

    return <article className="pt-23  bg-aquamarine h-screen w-screen">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <div className="flex flex-row">

            <div className="absolute flex flex-row justify-end w-full gap-3 p-4">
                <button className="flex items-center justify-center w-9 h-9 rounded-full text-[5vw] text-spring-bud bg-folly  drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]" type="button" onClick={() => alert('Compartir')}><FaShareAlt /></button>
                <button className="flex items-center justify-center w-9 h-9 rounded-full text-[5vw] text-spring-bud bg-folly  drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]" type="button" onClick={() => alert('Añadir a lista')}><FaListUl /></button>
            </div>

            <div className="h-50 w-full flex flex-row bg-violet">
                {recipe.images.map((image, index) => (
                    <img key={index} src={image} alt={`Recipe image ${index + 1}`} className="w-full h-50 object-cover" aria-placeholder="" />
                ))}
            </div>
        </div>

        <div className="p-5 mx-auto -mt-8 flex flex-col justify-center align-middle items-center text-center text-canary bg-sgbus-green h-auto w-80 drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]">
            <h2 className="anybody-logo text-[6vw]/[120%]">{recipe.title}</h2>
            <h3 className=" mb-4 anybody text-[4vw] underline decoration-[0.5em]">@{author}</h3>
            <time className="anybody text-[3vw]">{formatDate(recipe.date)}</time>
        </div>

        {recipe.description && <p className="mt-6 anybody text-violet text-[4vw]/[120%] w-80 justify-center mx-auto text-center">{recipe.description}</p>}

        {recipe.time && <div className="anybody-title text-violet text-[5vw] flex flex-row gap-2 justify-center mt-5">
            <h3>{recipe.time}</h3> · <h3>{recipe.difficulty}</h3>
        </div>}

        {recipe.tags && <div className=" text-spring-bud flex flex-wrap mt-8 mx-10 drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] gap-5 justify-center">{recipe.tags.map((tag, index) => (
            <h3 className="bg-folly anybody-title py-0.5 px-2 text-[3vw]" key={index}>#{tag}</h3>
        ))}
        </div>}

        <div className="flex flex-col justify-items-center items-center mt-10 py-5 bg-hot-magenta">
            <h2 className="mt-2 anybody-logo text-spring-bud text-[7vw] drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]">Ingredientes</h2>

            <div className="text-spring-bud text-center mt-5">
                {recipe.ingredients.map((ingredient, index) => (
                    <div className="anybody text-[5vw]/[120%] my-4" key={index}>
                        <p><text className="font-extrabold">{ingredient.name}</text> <text>{ingredient.quantity}</text> <text>{ingredient.unit}</text> {ingredient.annotation && <text className="italic">({ingredient.annotation})</text>}</p>
                    </div>
                ))}
            </div>

            <h2 className="anybody-logo mt-8 text-spring-bud text-[7vw] drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]">Preparación</h2>

            <div className="text-hot-magenta mt-5 text-center w-90">
                {recipe.steps.map((step, index) => (
                    <div className="flex flex-col gap-3 mb-5 px-5 py-5 bg-spring-bud drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]" key={index}>
                        <h3 className="anybody-logo text-[6vw]">{index + 1}</h3>
                        <p className="anybody text-[5vw]/[120%]">{step.text}</p>
                        {step.note && <p className="anybody text-[4vw]/[120%] italic">({step.note})</p>}
                        {step.image && (
                            <img
                                src={step.image}
                                alt={`step ${index + 1} image`}
                                className="w-full h-40 object-cover mt-3"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-row gap-8 my-8">
                <button
                    className="bg-hot-magenta text-aquamarine text-[12vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <FaChevronCircleLeft />
                </button>

                <button
                    className="bg-hot-magenta text-aquamarine text-[12vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <FaChevronCircleUp />
                </button>
            </div>
        </div>

        <button type="button" onClick={handleEditRecipeButton}>Editar receta</button>

    </article >
}

export default Recipe