import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'

import { MdDelete } from "react-icons/md"
import { MdSave } from "react-icons/md"
import { MdRemoveRedEye } from "react-icons/md"
import { FaChevronCircleUp } from "react-icons/fa"
import { FaChevronCircleLeft } from "react-icons/fa"

import Header from '../common/Header'

import logic from '../../../logic'

import { useAppContext } from '../../../context'

function SaveRecipe({
    view,
    onToRecipeClicked,
    onRecipeDeleted,
    onUserLoggedOut,
    onLogoClicked,
    onSaveRecipeBackButtonClicked
}) {
    const { alert, confirm } = useAppContext()
    const { id: recipeId } = useParams()

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
        let difficulty = form.difficulty.value.trim().toLowerCase() || undefined

        if (!title) {
            alert('Añade un título a tu receta')

            return
        }

        const difficultyMap = {
            'fácil': 'easy',
            'media': 'medium',
            'difícil': 'difficult',


            'facil': 'easy',
            'dificil': 'difficult',

            'easy': 'easy',
            'medium': 'medium',
            'difficult': 'difficult'
        }

        difficulty = difficultyMap[difficulty] || undefined

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

        if (!image) {
            alert('Añade la url de la imagen')

            return
        }

        logic.addImageToRecipe(recipe.id, image)
            .then(() => {
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    images: [...(prevRecipe.images ?? []), image] // Asegura que images sea un array
                }))
                form.reset()
            })
            .catch(error => {
                if (error.message === 'too many images, max 2 allowed') {
                    alert('Solo puedes añadir un máximo de 2 imágenes a tu receta')
                } else {
                    alert(error.message)
                }

                console.error(error)
            })
    }

    const handleDeleteImageButton = (event, index) => {
        event.preventDefault()

        confirm('¿Quieres eliminar esta imagen?', accepted => {

            if (accepted) {
                try {
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
                } catch (error) {
                    alert(error.message)

                    console.error(error)
                }
            }
        })
    }

    const handleTagFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const tag = form.tag.value.trim().toLowerCase()

        if (!tag) {
            alert('Añade una etiqueta')

            return
        }

        logic.addTagToRecipe(recipe.id, tag)
            .then(() => {
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    tags: [...(prevRecipe.tags ?? []), tag] // Asegura que tags sea un array
                }))
                form.reset()
            })
            .catch(error => {
                if (error.message === 'too many tags, max 15 allowed') {
                    alert('Solo puedes añadir un máximo de 15 etiquetas a tu receta')
                } else {
                    alert(error.message)
                }

                console.error(error)
            })
    }

    const handleDeleteTagButton = (event, index) => {
        event.preventDefault()

        confirm('¿Quieres eliminar esta etiqueta?', accepted => {
            if (accepted) {
                try {
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
                } catch (error) {
                    alert(error.message)

                    console.error(error)
                }
            }
        })
    }

    const handleIngredientFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value.trim()
        const quantity = parseFloat(event.target.quantity.value.trim())
        const unit = event.target.unit.value.trim()
        const annotation = event.target.annotation.value.trim() || undefined
        const main = form.main.checked

        if (!name) {
            alert('El ingrediente debe tener un nombre')

            return
        }

        if (!quantity) {
            alert('El ingrediente debe tener una cantidad (número)')

            return
        }

        if (!unit) {
            alert('El ingrediente debe tener una unidad (g, kg, ml, uds...)')

            return
        }

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

        confirm('¿Quieres eliminar este ingrediente?', accepted => {
            if (accepted) {
                try {
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
                } catch (error) {
                    alert(error.message)

                    console.error(error)
                }
            }
        })
    }

    const handleStepFormSubmit = (event) => {
        event.preventDefault()

        const form = event.target

        const text = form.text.value.trim()
        const note = form.note.value.trim() || undefined
        const image = form.image.value.trim() || undefined

        if (!text) {
            alert('El nuevo paso debe tener instrucciones')

            return
        }

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

        confirm('¿Quieres eliminar este paso?', accepted => {
            if (accepted) {
                try {
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
                } catch (error) {
                    alert(error.message)

                    console.error(error)
                }
            }
        })
    }

    const handleSaveRecipeBackButton = (event) => {
        event.preventDefault()

        onSaveRecipeBackButtonClicked()
    }

    const handleToRecipeClick = (event) => {
        event.preventDefault()

        onToRecipeClicked(recipe.id)
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

    if (!recipe) return <p>Cargando receta...</p>

    const mainIngredients = (recipe.ingredients ?? []).filter(ingredient => ingredient.main)
    const pantryIngredients = (recipe.ingredients ?? []).filter(ingredient => !ingredient.main)

    const difficultyTranslations = {
        easy: 'Fácil',
        medium: 'Media',
        difficult: 'Difícil'
    }

    // Estilos comunes (TailwindCSS)
    const inputClasses = `
        flex items-center justify-center

        p-5

        rounded-full
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] focus:outline-5 

        anybody text-center text-[4vw]
        min-w-0 truncate placeholder:italic
    `
    const labelClasses = `
        flex items-center justify-center -mb-3
        anybody text-center text-[5vw] font-bold
    `

    const btnClasses = `
        rounded-full 

        h-[15vw] w-[15vw]
        justify-items-center
    
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]

        anybody-logo

        transition-transform duration-150 ease-out
        hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
        hover:-translate-y-2 hover:scale-105
    `
    console.log('CreateRecipe -> render')

    return <section className="pt-23 bg-folly h-full w-screen">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <h1 className="flex justify-center text-center py-5 mt-5 anybody-logo text-spring-bud text-[7vw] drop-shadow-[0.15em_0.15em_0_rgba(0,0,0,0.8)]">
            {view === "update" ? "Edita tu receta" : "Crea tu nueva receta"}
        </h1>

        <main className="flex flex-col items-center w-90 mx-auto">
            {/* recipe */}
            <form className="flex flex-col w-full gap-5 mb-5" onSubmit={handleRecipeFormSubmit}>
                <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Título*</label>
                <input
                    className={`${inputClasses} h-10 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                    type="text"
                    name="title"
                    placeholder="Pon un título a tu receta"
                    defaultValue={recipe.title}
                    maxLength={100}
                    required
                    title="Campo obligatorio. Máximo 100 caracteres"
                />

                <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Descripción</label>
                <textarea
                    className="w-full bg-spring-bud text-folly flex items-center justify-center p-5 rounded-2xl drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] focus:outline-5 anybody placeholder:italic text-center text-[4vw]/[120%] focus:bg-folly focus:text-spring-bud focus:outline-spring-bud"
                    name="description"
                    placeholder="Describe tu receta ¡cuéntanos más!"
                    defaultValue={recipe.description}
                    maxLength={500}
                    title="Máximo 500 caracteres"
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    wrap="soft"
                />

                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col gap-5">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Tiempo</label>
                        <input
                            className={`${inputClasses} h-10 w-37 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            type="number"
                            name="time"
                            placeholder="En minutos"
                            defaultValue={recipe.time || 5}
                            min={5}
                            max={9999}
                            step={5}
                            title="Tiempo en minutos. Múltiplos de 5"
                        />
                    </div>

                    {/* <div className="flex flex-col gap-5">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="difficulty">Dificultad</label>
                        <select
                            className={`${inputClasses} h-10 w-37 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            name="difficulty"
                            defaultValue={recipe.difficulty}
                        >
                            <option value="easy">Fácil</option>
                            <option value="medium">Media</option>
                            <option value="difficult">Difícil</option>
                        </select>
                    </div> */}
                    <div className="flex flex-col gap-5">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Dificultad</label>
                        <input
                            className={`${inputClasses} h-10 w-37 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            type="text"
                            name="difficulty"
                            placeholder="Fácil, media o dificil"
                            defaultValue={difficultyTranslations[recipe.difficulty] || ''}
                            pattern="^([Ff][AaÁá]cil|[Mm]edia|[Dd][IiÍí][Ff][IiÍí]cil|[Ee]asy|[Mm]edium|[Dd]ifficult)$"
                            title="Fácil, media o difícil"
                        />
                    </div>

                </div>
                <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
            </form>

            <form className="flex flex-col items-center w-90 gap-5 my-5 py-5 bg-spring-bud drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]" onSubmit={handleImageFormSubmit}>
                <label className={`${labelClasses} pb-3 text-folly`} htmlFor="image">Imágenes</label>

                <ul className="flex flex-wrap gap-2 justify-center">
                    {(recipe.images ?? []).map((image, index) => (
                        <li className="relative" key={index}>
                            <button className="absolute top-2 right-2 bg-folly text-spring-bud text-[5vw] rounded-full p-1 drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]" type="button" onClick={(event) => handleDeleteImageButton(event, index)}><MdDelete /></button>
                            <img src={image} alt={`Image ${index}`} className="h-30 w-40 object-cover" />

                        </li>
                    ))}
                </ul>

                <input
                    className={`${inputClasses} h-10 w-80 bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly`}
                    type="url"
                    name="image"
                    placeholder="Pega aquí la URL de la imagen"
                    title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg (Máximo 2 imágenes)"
                />

                <button className={`${btnClasses} bg-folly text-spring-bud mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
            </form >

            <form className="flex flex-col items-center w-90 gap-5 my-5 py-5 bg-spring-bud drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]" onSubmit={handleTagFormSubmit}>
                <label className={`${labelClasses} pb-3 text-folly`} htmlFor="tag">Etiquetas</label>

                <ul className="flex flex-wrap mx-auto w-full px-5">
                    {(recipe.tags ?? []).map((tag, index) => (
                        <li className="flex flex-row text-spring-bud gap-2 mx-3 my-2" key={index}>
                            <h3 className="bg-folly anybody-title py-1 h-7 px-2 text-[3.5vw] drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]">#{tag}</h3>
                            <button className="text-folly text-[6vw] p-0.5 rounded-full" type="button" onClick={(event) => handleDeleteTagButton(event, index)}><MdDelete /></button>
                        </li>

                    ))}
                </ul>

                <input
                    className={`${inputClasses} h-10 w-80 bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly placeholder:normal-case`}
                    type="text"
                    name="tag"
                    placeholder="Añade etiquetas a tu receta"
                    title="Solo letras minúsculas, números, guiones y guiones bajos. Sin espacios y máximo 30 caracteres"
                    pattern="^[a-z0-9\-_]+$"
                    style={{ textTransform: 'lowercase' }}
                    maxLength={30}
                />
                <button className={`${btnClasses} bg-folly text-spring-bud mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
            </form>

            {/* Ingredients */}
            <form className="flex flex-col gap-5 items-center w-full my-5 py-8 bg-spring-bud drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]" onSubmit={handleIngredientFormSubmit}>
                <h2 className="anybody-title text-folly text-[6vw]">Ingredientes</h2>

                <div> {/* Lista de ingredientes */}
                    <div>
                        {/* Ingredientes principales */}
                        {mainIngredients.length > 0 && (
                            <>
                                <h3 className="w-30 mb-5 mx-auto anybody-title bg-folly text-spring-bud font-bold text-center drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]">
                                    Principales
                                </h3>
                                <ul className="flex flex-col items-center gap-2">
                                    {mainIngredients.map((ingredient, index) => (
                                        <li key={index} className="flex flex-row gap-2 items-start justify-center text-folly text-center px-5">
                                            <button className="text-[6vw]" type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)}>
                                                <MdDelete />
                                            </button>
                                            <p className=" text-[4vw]/[120%]">
                                                <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                {ingredient.annotation && <span className="italic"> ({ingredient.annotation})</span>}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Ingredientes de despensa */}
                        {pantryIngredients.length > 0 && (
                            <>
                                <h3 className="w-30 mt-7 mb-5 mx-auto anybody-title bg-folly text-spring-bud font-bold text-center drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]">
                                    Despensa
                                </h3>
                                <ul className="flex flex-col items-center gap-2">
                                    {pantryIngredients.map((ingredient, index) => (
                                        <li key={index} className="flex flex-row gap-2 items-start justify-center text-folly text-center px-5">
                                            <button className="text-[6vw]" type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)}>
                                                <MdDelete />
                                            </button>
                                            <p className=" text-[4vw]/[120%]">
                                                <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                {ingredient.annotation && <span className="italic"> ({ingredient.annotation})</span>}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                {/* Nuevo ingrediente */}
                <div className="flex flex-col py-5 gap-5 bg-folly w-80 drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]">
                    <h3 className="flex justify-center anybody-title text-spring-bud text-[6vw]">Nuevo ingrediente</h3>

                    {/* inputs de nuevo ingrediente */}
                    <div className="flex flex-col w-full items-center gap-5">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="name">Nombre*</label>
                        <input
                            className={`${inputClasses} h-10 w-70 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            type="text"
                            name="name"
                            placeholder="Añade un nombre al ingrediente"
                            required
                            maxLength={50}
                            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$"
                            title="Solo letras y espacios, hasta 50 caracteres"
                        />
                        <div className="flex flex-row justify-between w-70">
                            <div className="flex flex-col gap-5">
                                <label className={`${labelClasses} text-spring-bud`} htmlFor="quantity">Cantidad*</label>
                                <input
                                    className={`${inputClasses} h-10 w-32 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                                    type="number"
                                    name="quantity"
                                    placeholder="Número"
                                    min={0}
                                    max={9999}
                                    step={0.01}
                                    inputMode="decimal"
                                    title="Introduce una cantidad entre 0 y 9999, hasta 2 decimales con punto (ej. 1.55)"
                                />
                            </div>

                            <div className="flex flex-col gap-5">
                                <label className={`${labelClasses} text-spring-bud`} htmlFor="unit">Unidad*</label>
                                <input
                                    className={`${inputClasses} h-10 w-32 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                                    type="text"
                                    name="unit"
                                    placeholder="g, uds, ml..."
                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                    maxlength={20}
                                    title="Solo letras, espacios y tildes. Máximo 20 caracteres"
                                />
                            </div>
                        </div>

                        <label className={`${labelClasses} text-spring-bud`} htmlFor="annotation">Anotación</label>
                        <input
                            className={`${inputClasses} h-10 w-70 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            type="text"
                            name="annotation"
                            placeholder="¿Necesitas alguna aclaración?"
                            maxlength={50}
                            title="Máximo 50 caracteres"
                        />

                        <div className="flex flex-row justify-between w-70 items-center">
                            <label className={`flex items-center justify-center anybody text-center text-[5vw] font-bold text-spring-bud`} htmlFor="main">¿Ingrediente principal?</label>
                            <input
                                className="w-6 h-6 accent-spring-bud p"
                                type="checkbox"
                                defaultChecked="true"
                                name="main"
                            />
                        </div>
                    </div>

                    <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
                </div>
            </form>

            {/* Steps*/}
            <form className="flex flex-col gap-5 items-center w-full my-5 py-8 bg-spring-bud drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]" onSubmit={handleStepFormSubmit}>
                <h2 className="anybody-title text-folly text-[6vw]">Pasos</h2>

                <ul className="flex flex-col items-center gap-5 text-folly w-80 justify-center text-center">
                    {(recipe.steps ?? []).map((step, index) => (
                        <li className="flex flex-col gap-3 items-center" key={index}>
                            <h3 className="anybody-logo text-[5vw]">{index + 1}</h3>
                            <div><strong>{step.text}</strong></div>
                            {step.note && <div className="italic">{step.note}</div>}
                            {step.image && <img src={step.image} alt={`Image ${index + 1}`} className="" />}
                            <button className="text-[6vw]" type="button" onClick={(event) => handleDeleteStepButton(event, step.id)}>
                                <MdDelete />
                            </button>
                            <div className="bg-folly h-1 my-3 w-80"></div>
                        </li>
                    ))}
                </ul>

                {/* Nuevo paso */}
                <div className="flex flex-col py-5 gap-5 bg-folly w-80 drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]">
                    <h3 className="flex justify-center anybody-title text-spring-bud text-[6vw]">Nuevo Paso</h3>

                    <div className="flex flex-col w-full items-center gap-5">
                        <div className="flex flex-col w-full items-center gap-5">
                            <label className={`${labelClasses} text-spring-bud`} htmlFor="text">Instrucciones*</label>
                            <textarea
                                className="w-70 bg-spring-bud text-folly flex items-center justify-center p-5 rounded-2xl drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] focus:outline-5 anybody placeholder:italic text-center text-[4vw]/[120%] focus:bg-folly focus:text-spring-bud focus:outline-spring-bud"
                                name="text"
                                placeholder="Añade las instrucciones del paso"
                                maxLength={800}
                                title="Máximo 800 caracteres"
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                wrap="soft"
                                required
                            />
                        </div>

                        <div className="flex flex-col w-full items-center gap-5">
                            <label className={`${labelClasses} text-spring-bud`} htmlFor="note">Nota</label>
                            <textarea
                                className="w-70 bg-spring-bud text-folly flex items-center justify-center p-5 rounded-2xl drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] focus:outline-5 anybody placeholder:italic text-center text-[4vw]/[120%] focus:bg-folly focus:text-spring-bud focus:outline-spring-bud"
                                name="note"
                                placeholder="¿Necesitas aclarar algo?"
                                maxLength={500}
                                title="Máximo 500 caracteres"
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                wrap="soft"
                            />
                        </div>

                        <div className="flex flex-col w-full items-center gap-5">
                            <label className={`${labelClasses} text-spring-bud`} htmlFor="image">Imagen</label>
                            <input
                                className={`${inputClasses} h-10 w-70 bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                                type="url"
                                name="image"
                                placeholder="Pega aquí la url de la imagen"
                                title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                            />
                        </div>
                    </div>
                    <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
                </div>
            </form>

            {/* Botones */}
            <div className="flex flex-row gap-8 pt-5 pb-10 px-5 -mt-1 w-full justify-between">
                <div className="flex flex-row gap-5">
                    <button
                        className="bg-folly text-spring-bud text-[12vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12"
                        onClick={handleSaveRecipeBackButton}
                    >
                        <FaChevronCircleLeft />
                    </button>

                    <button
                        className="bg-folly text-spring-bud text-[12vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <FaChevronCircleUp />
                    </button>
                </div>
                <div className="flex flex-row gap-5">
                    <button className="bg-spring-bud text-folly text-[8vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12 flex items-center justify-center" type="button" onClick={handleToRecipeClick}><MdRemoveRedEye /></button>

                    <button className="bg-spring-bud text-folly text-[8vw] rounded-full transition drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] h-12 w-12 flex items-center justify-center" type="button" onClick={handleDeleteButtonClick}><MdDelete /></button>
                </div>
            </div>
        </main >
    </section >
}

export default SaveRecipe