import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'

import Header from '../common/Header'

import logic from '../../../logic'

// import { useAppContext } from '../../context'

function SaveRecipe({ view, onToRecipeClicked, onRecipeDeleted, onUserLoggedOut, onLogoClicked }) {
    // const { alert } = useAppContext()
    const { id: recipeId } = useParams()
    console.log(recipeId)

    const [recipe, setRecipe] = useState(null)

    useEffect(() => {
        console.log('recipe -> "componentDidMount" (useEffect)')

        loadRecipe(recipeId)
    }, [recipeId])

    const loadRecipe = (recipeId) => {
        if (!recipeId) {
            return
        }
        try {
            logic.getRecipeById(recipeId)
                .then(recipe => setRecipe(recipe))
                .catch(error => {
                    alert(error.message)

                    console.error(error)
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleLogoLinkCLick = () => onLogoClicked()

    const handleRecipeFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const title = form.title.value.trim()
        const description = form.description.value.trim() || undefined
        const time = parseFloat(form.time.value.trim()) || undefined
        const difficulty = form.difficulty.value.trim() || undefined

        if (!title) return

        logic.updateRecipe(recipe.id, title, description, time, difficulty)
            .then(() => {
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    title,
                    description,
                    time,
                    difficulty
                }))

                form.reset()
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleImageFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const image = form.image.value.trim()

        if (!image) return

        logic.addImageToRecipe(recipe.id, image)
            .then(() => {
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    images: [...(prevRecipe.images ?? []), image] // Asegura que images sea un array
                }))
                form.reset()
            })
            .catch(error => {
                alert(error.message)

                console.error(error)
            })
    }

    const handleDeleteImageButton = (event, index) => {
        event.preventDefault()
        console.log('index:', index)
        if (window.confirm('¿Eliminar esta imagen?')) {
            logic.removeImageFromRecipe(recipe.id, index)
                .then(() => {
                    setRecipe(prevRecipe => ({
                        ...prevRecipe,
                        images: prevRecipe.images.filter((image, index2) => index2 !== index)
                    }))
                })
                .catch(error => {
                    alert(error.message)
                    console.error(error)
                })
        }
    }

    const handleTagFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const tag = form.tag.value.trim()

        if (!tag) return

        logic.addTagToRecipe(recipe.id, tag)
            .then(() => {
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    tags: [...(prevRecipe.tags ?? []), tag] // Asegura que tags sea un array
                }))
                form.reset()
            })
            .catch(error => {
                alert(error.message)

                console.error(error)
            })
    }

    const handleDeleteTagButton = (event, index) => {
        event.preventDefault()
        console.log('index:', index)
        if (window.confirm('¿Eliminar esta etiqueta?')) {
            logic.removeTagFromRecipe(recipe.id, index)
                .then(() => {
                    setRecipe(prevRecipe => ({
                        ...prevRecipe,
                        tags: prevRecipe.tags.filter((tag, index2) => index2 !== index)
                    }))
                })
                .catch(error => {
                    alert(error.message)
                    console.error(error)
                })
        }
    }

    const handleIngredientFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value.trim()
        const quantity = parseFloat(event.target.quantity.value.trim())
        const unit = event.target.unit.value.trim()
        const annotation = event.target.annotation.value.trim() || undefined
        const main = form.main.checked

        if (!name) return
        if (!quantity) return
        if (!unit) return

        logic.addIngredientToRecipe(recipe.id, name, quantity, unit, annotation, main)
            .then((ingredientId) => {
                const newIngredient = { id: ingredientId, name, quantity, unit, annotation, main }

                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    ingredients: [...(prevRecipe.ingredients ?? []), newIngredient],  // Asegurarse de que ingredients sea un array
                }));

                form.reset()
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleDeleteIngredientButton = (event, ingredientId) => {
        event.preventDefault()
        console.log('ingredientId:', ingredientId)

        if (window.confirm('¿Eliminar ingrediente?')) {
            logic.removeIngredientFromRecipe(recipe.id, ingredientId)
                .then(() => {
                    setRecipe(prevRecipe => ({
                        ...prevRecipe,
                        ingredients: prevRecipe.ingredients.filter(ingredient => ingredient.id !== ingredientId)
                    }))
                })
                .catch(error => {
                    alert(error.message)
                    console.error(error)
                })
        }
    }

    const handleStepFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const text = form.text.value.trim()
        const note = form.note.value.trim() || undefined
        const image = form.image.value.trim() || undefined

        if (!text) return

        logic.addStepToRecipe(recipe.id, text, note, image)
            .then((stepId) => {
                const newStep = { id: stepId, text, note, image }

                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    steps: [...(prevRecipe.steps ?? []), newStep],  // Asegurar que steps sea un array
                }))

                form.reset()
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleDeleteStepButton = (event, stepId) => {
        event.preventDefault()
        console.log('stepId:', stepId)

        if (window.confirm('¿Eliminar ingrediente?')) {
            logic.removeStepFromRecipe(recipe.id, stepId)
                .then(() => {
                    setRecipe(prevRecipe => ({
                        ...prevRecipe,
                        steps: prevRecipe.steps.filter(step => step.id !== stepId)
                    }))
                })
                .catch(error => {
                    alert(error.message)
                    console.error(error)
                })
        }
    }

    const handleToRecipeClick = (event) => {
        event.preventDefault()

        onToRecipeClicked(recipe.id)
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

    if (!recipe) return <p>Cargando receta...</p>

    console.log('CreateRecipe -> render')

    return <section className="flex flex-col pt-23 gap-10">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <main className="flex flex-col items-center">
            <h1 className="m-5">Crea tu nueva receta</h1>

            <form className="flex flex-col w-80 gap-3 mb-5" onSubmit={handleRecipeFormSubmit}>
                <input
                    className="border-2"
                    type="text"
                    name="title"
                    placeholder="Pon un nombre a tu receta"
                    defaultValue={recipe.title}
                />
                <textarea
                    className="border-2"
                    type="text"
                    name="description"
                    placeholder="describe brevemente tu receta"
                    defaultValue={recipe.description}
                />
                <input
                    className="border-2"
                    type="number"
                    name="time"
                    placeholder="¿cuánto se tarda? en minutos"
                    defaultValue={recipe.time}
                />
                <input
                    className="border-2"
                    type="text"
                    name="difficulty"
                    placeholder="easy, medium o difficult"
                    defaultValue={recipe.difficulty}
                />
                <button type="submit">Actualizar receta</button>
            </form>

            <form className="flex flex-col w-80 gap-3 mb-5" onSubmit={handleImageFormSubmit}>
                <input
                    className="border-2"
                    type="url"
                    name="image"
                    placeholder="Añadir imagen"
                />
                <button type="submit">Agregar imagen</button>

                <ul className="flex flex-wrap">
                    {(recipe.images ?? []).map((image, index) => (
                        <li key={index}>
                            <img src={image} alt={`Image ${index}`} className="h-30 w-auto" />
                            <button type="button" onClick={(event) => handleDeleteImageButton(event, index)}>❌</button>
                        </li>
                    ))}
                </ul>
            </form>

            <form className="flex flex-col w-80 gap-3 mb-5" onSubmit={handleTagFormSubmit}>
                <input
                    className="border-2"
                    type="text"
                    name="tag"
                    placeholder="Añadir etiqueta"
                />
                <button type="submit">Añadir etiqueta</button>

                <ul>
                    {(recipe.tags ?? []).map((tag, index) => (
                        <li key={index}>
                            #{tag}
                            <button type="button" onClick={(event) => handleDeleteTagButton(event, index)}>❌</button>
                        </li>

                    ))}
                </ul>
            </form>

            <form className="flex flex-col w-80 gap-3 mb-5" onSubmit={handleIngredientFormSubmit}>
                <input
                    className="border-2"
                    type="text"
                    name="name"
                    placeholder="Añadir nombre"
                />
                <input
                    className="border-2"
                    type="number"
                    name="quantity"
                    placeholder="Añadir cantidad"
                />
                <input
                    className="border-2"
                    type="text"
                    name="unit"
                    placeholder="Añadir unidad"
                />
                <input
                    className="border-2"
                    type="text"
                    name="annotation"
                    placeholder="Añadir anotación"
                />
                <label htmlFor="main">
                    <input
                        className="border-2"
                        type="checkbox"
                        defaultChecked="true"
                        name="main"
                    />
                    ¿Ingrediente principal?</label>

                <button type="submit">Agregar ingrediente</button>

                <ul className="flex flex-wrap">
                    {(recipe.ingredients ?? []).map((ingredient, index) => (
                        <li key={index} className="border p-2 m-2">
                            <div><strong>{ingredient.name}</strong></div>
                            <div>Cantidad: {ingredient.quantity}</div>
                            <div>Unidad: {ingredient.unit}</div>
                            <div>Nota: {ingredient.annotation}</div>
                            <div>Principal: {ingredient.main ? 'Sí' : 'No'}</div>
                            <button type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)}>❌</button>
                        </li>
                    ))}
                </ul>
            </form>

            <form className="flex flex-col w-80 gap-3 mb-5" onSubmit={handleStepFormSubmit}>
                <textarea
                    className="border-2"
                    type="text"
                    name="text"
                    placeholder="Añadir paso"
                />
                <input
                    className="border-2"
                    type="text"
                    name="note"
                    placeholder="Añadir nota"
                />
                <input
                    className="border-2"
                    type="url"
                    name="image"
                    placeholder="Añadir imagen"
                />
                <button type="submit">Agregar paso</button>

                <ul className="flex flex-wrap">
                    {(recipe.steps ?? []).map((step, index) => (
                        <li key={index} className="border p-2 m-2">
                            <div><strong>{step.text}</strong></div>
                            <div>nota: {step.note}</div>
                            {step.image && <img src={step.image} alt={`Image ${index}`} className="h-30 w-auto" />}
                            <button type="button" onClick={(event) => handleDeleteStepButton(event, step.id)}>❌</button>
                        </li>
                    ))}
                </ul>
            </form>

            <a href="" onClick={handleToRecipeClick}>Ir a la receta </a>
            <button type="button" onClick={handleDeleteButtonClick}>Eliminar receta ❌</button>
        </main>

    </section >
}

export default SaveRecipe