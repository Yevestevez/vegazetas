import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'

import { MdDelete } from "react-icons/md"
import { MdSave } from "react-icons/md"
import { MdRemoveRedEye } from "react-icons/md"
import { FaChevronUp } from "react-icons/fa"
import { FaChevronLeft } from "react-icons/fa"

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

    // Efecto para ajustar la altura de los textareas
    useEffect(() => {
        const adjustTextareaHeight = (textarea) => {
            if (textarea) {
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight + 'px'
            }
        }

        const descriptionTextarea = document.querySelector('textarea[name="description"]')
        const textTextarea = document.querySelector('textarea[name="text"]')
        const noteTextarea = document.querySelector('textarea[name="note"]')

        adjustTextareaHeight(descriptionTextarea)
        adjustTextareaHeight(textTextarea)
        adjustTextareaHeight(noteTextarea)
    }, [recipe?.description, recipe?.steps])

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
        flex items-center justify-center align-middle

        p-[4vw] h-[8vw]

        rounded-full
        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
        focus:outline-[1vw] sm:focus:outline-[0.6vw]

        anybody text-center text-[4vw] sm:text-[3.5vw]
        min-w-0 truncate placeholder:italic placeholder:text-[4vw] sm:placeholder:text-[3.5vw]
    `
    const labelClasses = `
        flex items-center justify-center -mb-[4vw] sm:-mb-[3vw]
        anybody text-center text-[5vw] sm:text-[4vw] font-bold
    `

    const btnClasses = `
        rounded-full 

        h-[15vw] w-[15vw] sm:h-[12vw] sm:w-[12vw]
        justify-items-center
    
        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

        anybody-logo

        transition-transform duration-150 ease-out
        hover:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)]
        hover:-translate-y-2 hover:scale-105
    `
    console.log('CreateRecipe -> render')

    return <section className="
        /* Layout */
        pt-[20vw] h-full w-screen

        /* Colores */
        bg-folly
    ">
        {/* ===== HEADER ===== */}
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        {/* ===== TÍTULO DE LA PÁGINA ===== */}
        <h1 className="
            /* Layout */
            flex justify-center text-center py-[5vw] sm:py-[3vw] mt-[6vw] sm:mt-[3vw]

            /* Tipografía */
            anybody-logo text-[7vw] sm:text-[6vw] text-spring-bud

            /* Sombra */
            drop-shadow-[0.15em_0.15em_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)]
        ">
            {view === "update" ? "Edita tu receta" : "Crea tu nueva receta"}
        </h1>

        {/* ===== CONTENIDO PRINCIPAL ===== */}
        <main className="
            /* Layout */
            flex flex-col items-center w-[80vw] mx-auto
        ">
            {/* ===== FORMULARIO DE RECETA ===== */}
            <form className="
                /* Layout */
                flex flex-col w-full gap-6 sm:gap-8 mb-[5vw]
            " onSubmit={handleRecipeFormSubmit}>
                <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Título*</label>
                <input
                    className={`${inputClasses} bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                    type="text"
                    name="title"
                    placeholder="Pon un título a tu receta"
                    defaultValue={recipe.title}
                    maxLength={50}
                    required
                    title="Campo obligatorio. Máximo 50 caracteres"
                />

                <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Descripción</label>
                <textarea
                    className="
                        /* Layout */
                        w-full flex items-center justify-center p-[4vw] rounded-2xl min-h-auto resize-none
                        focus:outline-[1vw] sm:focus:outline-[0.6vw]

                        /* Tipografía */
                        anybody text-center text-[4vw]/[120%] sm:text-[3.5vw]/[120%] placeholder:text-[4vw]/[120%] sm:placeholder:text-[3.5vw]/[120%] placeholder:italic

                        /* Colores */
                        bg-spring-bud text-folly
                        focus:bg-folly focus:text-spring-bud focus:outline-spring-bud

                        /* Sombra */
                        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                    "
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

                <div className="
                    /* Layout */
                    flex flex-row w-full justify-between
                ">
                    <div className="
                        /* Layout */
                        flex flex-col gap-6 sm:gap-8
                    ">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Tiempo</label>
                        <input
                            className={`${inputClasses} w-[36vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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

                    <div className="
                        /* Layout */
                        flex flex-col gap-6 sm:gap-8
                    ">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Dificultad</label>
                        <input
                            className={`${inputClasses} w-[36vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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

            {/* ===== FORMULARIO DE IMÁGENES ===== */}
            <form className="
                /* Layout */
                flex flex-col items-center w-[80vw] gap-6 sm:gap-8 my-[5vw] sm:my-[3vw] py-[5vw]

                /* Colores */
                bg-spring-bud

                /* Sombra */
                drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
            " onSubmit={handleImageFormSubmit}>
                <label className={`${labelClasses} pb-[2vw] sm:pb-[1vw] text-folly`} htmlFor="image">Imágenes</label>

                <ul className="
                    /* Layout */
                    flex flex-wrap gap-3 sm:gap-4 justify-center mt-[3vw]
                ">
                    {(recipe.images ?? []).map((image, index) => (
                        <li className="
                            /* Layout */
                            relative
                        " key={index}>
                            <button className="
                                /* Layout */
                                absolute top-[2vw] right-[2vw] sm:top-[1.5vw] sm:right-[1.5vw] rounded-full p-1

                                /* Tipografía */
                                text-[5vw] sm:text-[4vw]

                                /* Colores */
                                bg-folly text-spring-bud

                                /* Sombra */
                                drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                            " type="button" onClick={(event) => handleDeleteImageButton(event, index)}><MdDelete /></button>
                            <img src={image} alt={`Image ${index}`} className="
                                /* Layout */
                                h-[30vw] sm:h-[25vw] w-[35vw] object-cover
                            " />
                        </li>
                    ))}
                </ul>

                <input
                    className={`${inputClasses} w-[70vw] bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly`}
                    type="url"
                    name="image"
                    placeholder="Pega aquí la URL de la imagen"
                    title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg (Máximo 2 imágenes)"
                />

                <button className={`${btnClasses} bg-folly text-spring-bud mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
            </form>

            {/* ===== FORMULARIO DE ETIQUETAS ===== */}
            <form className="
                /* Layout */
                flex flex-col items-center w-[80vw] gap-6 sm:gap-8 my-[5vw] sm:my-[3vw] py-[5vw]

                /* Colores */
                bg-spring-bud

                /* Sombra */
                drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
            " onSubmit={handleTagFormSubmit}>
                <label className={`${labelClasses} pb-3 text-folly`} htmlFor="tag">Etiquetas</label>

                <ul className="
                    /* Layout */
                    flex flex-wrap mx-auto w-full px-[2vw]
                ">
                    {(recipe.tags ?? []).map((tag, index) => (
                        <li className="
                            /* Layout */
                            flex flex-row items-center gap-1 mx-[2vw] my-[1vw]

                            /* Colores */
                            text-spring-bud
                        " key={index}>
                            <h3 className="
                                /* Layout */
                                bg-folly anybody-title pt-[1vw] sm:pt-[0.5vw] h-[6vw] sm:h-[5vw] px-[2vw] sm:px-[1.2vw]
                                flex items-center

                                /* Tipografía */
                                text-[3.5vw] sm:text-[3vw]

                                /* Sombra */
                                drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                            ">#{tag}</h3>
                            <button className="
                                /* Layout */
                                text-folly p-[0.5vw]

                                /* Tipografía */
                                text-[7vw] sm:text-[6vw]
                            " type="button" onClick={(event) => handleDeleteTagButton(event, index)}><MdDelete /></button>
                        </li>
                    ))}
                </ul>

                <input
                    className={`${inputClasses} w-[70vw] bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly placeholder:normal-case`}
                    type="text"
                    name="tag"
                    placeholder="Añade etiquetas a tu receta"
                    title="Solo letras minúsculas, números, guiones y guiones bajos. Sin espacios y máximo 30 caracteres"
                    pattern="^[a-zA-Z0-9\-_]+$"
                    style={{ textTransform: 'lowercase' }}
                    maxLength={30}
                />
                <button className={`${btnClasses} bg-folly text-spring-bud mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
            </form>

            {/* ===== FORMULARIO DE INGREDIENTES ===== */}
            <form className="
                /* Layout */
                flex flex-col items-center w-[80vw] my-[5vw] sm:my-[3vw] py-[5vw]

                /* Colores */
                bg-spring-bud

                /* Sombra */
                drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
            " onSubmit={handleIngredientFormSubmit}>
                <h2 className="
                    /* Tipografía */
                    anybody-title text-folly text-[6vw] pt-[3vw]
                ">Ingredientes</h2>

                <div>
                    <div>
                        {/* Ingredientes principales */}
                        {mainIngredients.length > 0 && (
                            <>
                                <h3 className="
                                    /* Layout */
                                    w-[6em] mt-[6vw] mb-[5vw] mx-auto text-center

                                    /* Tipografía */
                                    anybody-title text-spring-bud font-bold text-[4vw] sm:text-[3.5vw]

                                    /* Colores */
                                    bg-folly

                                    /* Sombra */
                                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                                ">Principales</h3>
                                <ul className="
                                    /* Layout */
                                    flex flex-col items-start gap-3.5 sm:gap-5 w-full
                                ">
                                    {mainIngredients.map((ingredient, index) => (
                                        <li key={index} className="
                                            flex flex-row items-start gap-2 sm:gap-4 px-[5vw] w-full
                                            text-folly
                                        ">
                                            <button className="
                                                text-[5vw] sm:text-[4vw]
                                                self-start
                                            " type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)}>
                                                <MdDelete />
                                            </button>
                                            <p className="
                                                text-left text-[4vw]/[110%] sm:text-[3vw]/[110%]
                                            ">
                                                <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Ingredientes de despensa */}
                        {pantryIngredients.length > 0 && (
                            <>
                                <h3 className="
                                    /* Layout */
                                    w-[6em] mt-[6vw] mb-[5vw] mx-auto text-center

                                    /* Tipografía */
                                    anybody-title text-spring-bud font-bold text-[4vw] sm:text-[3.5vw]

                                    /* Colores */
                                    bg-folly

                                    /* Sombra */
                                    drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                                ">Despensa</h3>
                                <ul className="
                                    /* Layout */
                                    flex flex-col items-start gap-3.5 sm:gap-5 w-full
                                ">
                                    {pantryIngredients.map((ingredient, index) => (
                                        <li key={index} className="
                                            flex flex-row items-start gap-2 sm:gap-4 px-[5vw] w-full
                                            text-folly
                                        ">
                                            <button className="
                                                text-[5vw] sm:text-[4vw]
                                                self-start
                                            " type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)}>
                                                <MdDelete />
                                            </button>
                                            <p className="
                                                text-left text-[4vw]/[110%] sm:text-[3vw]/[110%]
                                            ">
                                                <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                {/* Nuevo ingrediente */}
                <div className="
                    /* Layout */
                    flex flex-col py-[5vw] gap-5 w-[70vw] mt-[6vw] mb-[1vw]

                    /* Colores */
                    bg-folly

                    /* Sombra */
                    drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
                ">
                    <h3 className="
                        /* Layout */
                        flex justify-center

                        /* Tipografía */
                        anybody-title text-spring-bud text-[6vw] sm:text-[5vw]
                    ">Nuevo ingrediente</h3>

                    {/* inputs de nuevo ingrediente */}
                    <div className="
                        /* Layout */
                        flex flex-col w-full items-center gap-8
                    ">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="name">Nombre*</label>
                        <input
                            className={`${inputClasses} w-[60vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            type="text"
                            name="name"
                            placeholder="Añade un nombre al ingrediente"
                            required
                            maxLength={50}
                            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$"
                            title="Solo letras y espacios, hasta 50 caracteres"
                        />
                        <div className="
                            /* Layout */
                            flex flex-row justify-between w-[60vw]
                        ">
                            <div className="
                                /* Layout */
                                flex flex-col gap-6 sm:gap-8
                            ">
                                <label className={`${labelClasses} text-spring-bud`} htmlFor="quantity">Cantidad*</label>
                                <input
                                    className={`${inputClasses} w-[22vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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

                            <div className="
                                /* Layout */
                                flex flex-col gap-6 sm:gap-8
                            ">
                                <label className={`${labelClasses} text-spring-bud`} htmlFor="unit">Unidad*</label>
                                <input
                                    className={`${inputClasses} w-[32vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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
                            className={`${inputClasses} w-[60vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            type="text"
                            name="annotation"
                            placeholder="¿Necesitas alguna aclaración?"
                            maxlength={50}
                            title="Máximo 50 caracteres"
                        />

                        <div className="
                            /* Layout */
                            flex flex-row justify-around w-[60vw] items-center align-middle gap-1
                        ">
                            <label className="
                                /* Layout */
                                flex items-center justify-center

                                /* Tipografía */
                                anybody text-center text-[5vw] sm:text-[4vw] font-bold
                                text-spring-bud
                            " htmlFor="main">¿Ingrediente principal?</label>
                            <input
                                className="
                                    /* Layout */
                                    w-[4vw] h-[4vw]

                                    /* Colores */
                                    accent-spring-bud
                                "
                                type="checkbox"
                                defaultChecked="true"
                                name="main"
                            />
                        </div>
                    </div>

                    <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] `} type="submit"><MdSave /></button>
                </div>
            </form>

            {/* ===== FORMULARIO DE PASOS ===== */}
            <form className="
                /* Layout */
                flex flex-col items-center w-[80vw] my-[5vw] sm:my-[3vw] py-[5vw]

                /* Colores */
                bg-spring-bud

                /* Sombra */
                drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
            " onSubmit={handleStepFormSubmit}>
                <h2 className="
                    /* Tipografía */
                    anybody-title text-folly text-[6vw] py-[3vw]
                ">Pasos</h2>

                <ul className="
                    /* Layout */
                    flex flex-col items-center text-folly w-[70vw] justify-center text-center gap-[3vw]
                ">
                    {(recipe.steps ?? []).map((step, index) => (
                        <li className="
                            /* Layout */
                            flex flex-col items-center
                        " key={index}>
                            <h3 className="
                                /* Tipografía */
                                anybody-logo text-[5vw]
                            ">{index + 1}</h3>
                            <div><strong>{step.text}</strong></div>
                            {step.note && <div className="italic">{step.note}</div>}
                            {step.image && <img src={step.image} alt={`Image ${index + 1}`} className="pt-[3vw]" />}
                            <button className="
                                /* Tipografía */
                                text-[6vw] sm:text-[5vw] mt-[3vw]
                            " type="button" onClick={(event) => handleDeleteStepButton(event, step.id)}>
                                <MdDelete />
                            </button>
                            <div className="
                                /* Layout */
                                bg-folly h-[0.5vw] mt-[6vw] mb-[3vw] w-[70vw]
                            "></div>
                        </li>
                    ))}
                </ul>

                {/* Nuevo paso */}
                <div className="
                    /* Layout */
                    flex flex-col py-[5vw] gap-5 w-[70vw] mt-[6vw] mb-[1vw]
                    bg-folly
                    drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
                ">
                    <h3 className="
                        /* Layout */
                        flex justify-center
                        anybody-title text-spring-bud text-[6vw] sm:text-[5vw]
                    ">Nuevo Paso</h3>

                    {/* inputs de nuevo paso */}
                    <div className="flex flex-col w-full items-center gap-8">
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="text">Instrucciones*</label>
                        <textarea
                            className="
                                w-[60vw] flex items-center justify-center p-[4vw] rounded-2xl min-h-auto resize-none
                                focus:outline-[1vw] sm:focus:outline-[0.6vw]
                                anybody text-center text-[4vw]/[120%] sm:text-[3.5vw]/[120%] placeholder:text-[4vw]/[120%] sm:placeholder:text-[3.5vw]/[120%] placeholder:italic
                                bg-spring-bud text-folly
                                focus:bg-folly focus:text-spring-bud focus:outline-spring-bud
                                drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                            "
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
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="note">Nota</label>
                        <textarea
                            className="
                                w-[60vw] flex items-center justify-center p-[4vw] rounded-2xl min-h-auto resize-none
                                focus:outline-[1vw] sm:focus:outline-[0.6vw]
                                anybody text-center text-[4vw]/[120%] sm:text-[3.5vw]/[120%] placeholder:text-[4vw]/[120%] sm:placeholder:text-[3.5vw]/[120%] placeholder:italic
                                bg-spring-bud text-folly
                                focus:bg-folly focus:text-spring-bud focus:outline-spring-bud
                                drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                            "
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
                        <label className={`${labelClasses} text-spring-bud`} htmlFor="image">Imagen</label>
                        <input
                            className={`${inputClasses} w-[60vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                            type="url"
                            name="image"
                            placeholder="Pega aquí la url de la imagen"
                            title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                        />
                    </div>
                    <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] mt-[2vw]`} type="submit"><MdSave /></button>
                </div>
            </form>

            {/* ===== BOTONES DE NAVEGACIÓN ===== */}
            <div className="
                /* Layout */
                flex flex-row gap-8 pt-[5vw] pb-[10vw] w-full justify-between
            ">
                <div className="
                    /* Layout */
                    flex flex-row gap-5 sm:gap-8
                ">
                    <button
                        className="
                            /* Layout */
                            h-[12vw] w-[12vw] rounded-full flex items-center justify-center  pr-[0.15em]

                            /* Colores */
                            bg-spring-bud text-folly
                            hover:bg-folly hover:text-spring-bud
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
                        onClick={handleSaveRecipeBackButton}
                    >
                        <FaChevronLeft />
                    </button>

                    <button
                        className="
                         /* Layout */
                            h-[12vw] w-[12vw] rounded-full flex items-center justify-center pb-[0.05em]

                            /* Colores */
                            bg-spring-bud text-folly
                            hover:bg-folly hover:text-spring-bud
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
                <div className="
                    /* Layout */
                    flex flex-row gap-5 sm:gap-8
                ">
                    <button className="
                        /* Layout */
                        h-[12vw] w-[12vw] rounded-full flex items-center justify-center

                        /* Colores */
                        bg-spring-bud text-folly
                        hover:bg-folly hover:text-spring-bud
                        hover:outline hover:outline-[0.1em] hover:outline-spring-bud

                        /* Tipografía */
                        text-[8vw]

                        /* Sombra */
                        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                        sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

                        /* Transiciones */
                        transition-all duration-100 ease-out
                        hover:-translate-y-1 hover:scale-105
                    " type="button" onClick={handleToRecipeClick}><MdRemoveRedEye /></button>

                    <button className="
                       /* Layout */
                        h-[12vw] w-[12vw] rounded-full flex items-center justify-center

                        /* Colores */
                        bg-spring-bud text-folly
                        hover:bg-folly hover:text-spring-bud
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
        </main>
    </section>
}

export default SaveRecipe