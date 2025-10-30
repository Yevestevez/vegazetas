import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { MdDelete, MdEdit, MdSave, MdRemoveRedEye } from 'react-icons/md'
import { FaChevronUp, FaChevronDown, FaChevronLeft } from 'react-icons/fa'
import { IoMdCloseCircle } from 'react-icons/io'

import logic from '../../../logic'
import { useAppContext } from '../../../context'

import Header from '../common/Header'

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
        loadRecipe(recipeId)
    }, [recipeId])

    const [difficulty, setDifficulty] = useState(recipe?.difficulty || "")
    useEffect(() => {
        if (recipe && recipe.difficulty) {
            setDifficulty(recipe.difficulty)
        }
    }, [recipe])

    const [editStep, setEditStep] = useState(null)

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
                    images: [...(prevRecipe.images ?? []), image]
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
                    tags: [...(prevRecipe.tags ?? []), tag]
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
                    ingredients: [...(prevRecipe.ingredients ?? []), newIngredient],
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
                    steps: [...(prevRecipe.steps ?? []), newStep],
                }))

                form.reset()
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleEditStepFormSubmit = (event) => {
        event.preventDefault()

        console.log('submit handler triggered')

        const stepId = editStep
        const form = event.target
        const text = form.text.value.trim()
        const note = form.note.value.trim() || undefined
        const image = form.image.value.trim() || undefined

        if (!text) {
            alert('El paso debe tener instrucciones')
            return
        }

        confirm('¿Quieres guardar los cambios en este paso?', accepted => {
            console.log('CONFIRM accepted:', accepted)

            if (!accepted) return

            try {
                logic.updateStep(recipe.id, stepId, text, note, image)
                    .then(() => {
                        setRecipe(prevRecipe => ({
                            ...prevRecipe,
                            steps: prevRecipe.steps.map(step =>
                                step.id === stepId
                                    ? { ...step, text, note, image }
                                    : step
                            )
                        }))

                        setEditStep(null)
                    })
                    .catch(error => {
                        alert(error.message)
                        console.error(error)
                    })
            } catch (error) {
                alert(error.message)
                console.error(error)
            }
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
                                steps: prevRecipe.steps
                                    .filter(step => step.id !== stepId)
                                    .map((step, index) => ({
                                        ...step,
                                        order: index
                                    }))
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

    const handleMoveStepUp = (event, stepId) => {
        event.preventDefault()

        const stepIndex = recipe.steps.findIndex(step => step.id === stepId)
        if (stepIndex > 0) {
            try {
                logic.reorderStep(recipe.id, stepId, 'up')
                    .then(() => {
                        setRecipe(prevRecipe => {
                            const newSteps = [...prevRecipe.steps]
                            const temp = newSteps[stepIndex]
                            newSteps[stepIndex] = newSteps[stepIndex - 1]
                            newSteps[stepIndex - 1] = temp

                            return {
                                ...prevRecipe,
                                steps: newSteps
                            };
                        });
                    })
                    .catch(error => {
                        alert(error.message)
                        console.error(error)
                    });
            } catch (error) {
                alert(error.message)
                console.error(error)
            }
        }
    }

    const handleMoveStepDown = (event, stepId) => {
        event.preventDefault()

        const stepIndex = recipe.steps.findIndex(step => step.id === stepId)
        if (stepIndex < recipe.steps.length - 1) {
            try {
                logic.reorderStep(recipe.id, stepId, 'down')
                    .then(() => {
                        setRecipe(prevRecipe => {
                            const newSteps = [...prevRecipe.steps]

                            const temp = newSteps[stepIndex]
                            newSteps[stepIndex] = newSteps[stepIndex + 1]
                            newSteps[stepIndex + 1] = temp

                            return {
                                ...prevRecipe,
                                steps: newSteps
                            };
                        });
                    })
                    .catch(error => {
                        alert(error.message)
                        console.error(error)
                    });
            } catch (error) {
                alert(error.message)
                console.error(error)
            }
        }
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

    // TailwindCSS common classes
    const inputClasses = `
        flex items-center justify-center align-middle rounded-full
        p-[4vw] xl:p-[1vw] h-[8vw] xl:h-[2.5vw]
        anybody text-center min-w-0 truncate placeholder:italic
        focus:outline-[1vw] sm:focus:outline-[0.6vw] xl:focus:outline-[0.3vw]
        text-[4vw] sm:text-[3.5vw] xl:text-[1vw]
        placeholder:text-[4vw] sm:placeholder:text-[3.5vw] xl:placeholder:text-[1vw]      
        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
    `
    const labelClasses = `flex items-center justify-center -mb-[3vw] xl:-mb-[1.5vw] anybody text-center text-[5vw] sm:text-[4vw] xl:text-[1.2vw] font-bold`

    const btnClasses = `
        rounded-full justify-items-center anybody-logo
        h-[15vw] sm:h-[12vw] xl:h-[4vw]
        w-[15vw] sm:w-[12vw] xl:w-[4vw]
        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
        hover:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] hover:xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.7)]
        transition-transform duration-150 ease-out hover:-translate-y-1 hover:scale-105
    `

    const footerButtonClasses = `
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

    const textareaClasses = `
        flex items-center justify-center rounded-2xl min-h-auto resize-none box-border
        anybody text-center placeholder:italic
        text-[4vw]/[120%] sm:text-[3.5vw]/[120%] xl:text-[1vw]/[120%]
        placeholder:text-[4vw]/[120%] sm:placeholder:text-[3.5vw]/[120%] xl:placeholder:text-[1vw]/[120%]
        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
        focus:outline-[1vw] sm:focus:outline-[0.6vw] xl:focus:outline-[0.25vw]
    `

    return <section className="flex flex-col min-h-screen w-full items-center xl:items-start pt-[21vw] sm:pt-[17vw] md:pt-[16vw] xl:pt-[0] overflow-hidden bg-folly">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <div className="flex flex-col xl:ml-[40vw] w-full xl:w-[35vw] mb-[30vw] sm:mb-[20vw] lg:mb-[16vw] xl:mb-[4vw]">
            <h1 className="
                    flex justify-center text-center py-[6vw] xl:py-[2vw]
                    anybody-logo text-[7vw] sm:text-[6vw] xl:text-[2.5vw] text-spring-bud
                    drop-shadow-[0.15em_0.15em_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.14em_0.14em_0_rgba(0,0,0,0.8)]
                ">
                {view === "update" ? "Edita tu receta" : "Crea tu nueva receta"}
            </h1>

            <main className="flex flex-col items-center w-[80vw] xl:w-[28vw] mx-auto">
                {/* ===== Recipe ===== */}
                <form className="flex flex-col w-full gap-[6vw] xl:gap-[2vw] mb-[5vw] xl:mb-[3vw]" onSubmit={handleRecipeFormSubmit}>
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
                        className={`${textareaClasses} w-full p-[4vw] xl:p-[2vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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
                        <div className="flex flex-col gap-[5vw] xl:gap-[2vw]">
                            <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Tiempo</label>
                            <input
                                className={`${inputClasses} w-[36vw] xl:w-[13vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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

                        <div className="flex flex-col gap-[5vw] xl:gap-[2vw]">
                            <label className={`${labelClasses} text-spring-bud`} htmlFor="title">Dificultad</label>
                            <select
                                className={`flex items-center justify-center align-middle rounded-full p-[1vw] xl:p-[0.5vw] h-[8vw] xl:h-[2.5vw] anybody text-center min-w-0 truncate placeholder:italic focus:outline-[1vw] sm:focus:outline-[0.6vw] xl:focus:outline-[0.3vw] text-[4vw] sm:text-[3.5vw] xl:text-[1vw] placeholder:text-[4vw] sm:placeholder:text-[3.5vw] xl:placeholder:text-[1vw] drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)] w-[36vw] xl:w-[13vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud appearance-none`}
                                name="difficulty"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="">-- Selecciona --</option>
                                <option value="easy">Fácil</option>
                                <option value="medium">Media</option>
                                <option value="difficult">Difícil</option>
                            </select>
                        </div>
                    </div>
                    <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] xl:text-[3vw]/[100%]`} type="submit"><MdSave /></button>
                </form>

                {/* ===== Images ===== */}
                <form className="
                        flex flex-col items-center my-[5vw] sm:my-[3vw] xl:my-[0vw] py-[5vw] xl:py-[2vw] gap-[5vw] sm:gap-[6vw] xl:gap-[2vw] w-[80vw] xl:w-[28vw] bg-spring-bud
                        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                    " onSubmit={handleImageFormSubmit}>
                    <label className={`${labelClasses} pb-[2vw] sm:pb-[1vw] text-folly`} htmlFor="image">Imágenes</label>

                    <ul className="flex flex-wrap gap-[2vw] sm:gap-[3vw] xl:gap-[1vw] justify-center mt-[3vw] xl:mt-0">
                        {(recipe.images ?? []).map((image, index) => (
                            <li className="
                                /* Layout */
                                relative
                            " key={index}>
                                <button className="
                                            absolute rounded-full p-[0.5vw] cursor-pointer
                                            top-[2vw] sm:top-[1.5vw] xl:top-[0.8vw]
                                            right-[2vw] sm:right-[1.5vw] xl:right-[0.8vw]
                                            text-[5vw] sm:text-[4vw] xl:text-[1.5vw]
                                            bg-folly text-spring-bud
                                            drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.8)]
                                            hover:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.7)] hover:sm:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.7)] hover:xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.7)]
                                            transition-transform duration-150 ease-out
                                            hover:-translate-y-1 hover:scale-105
                                        " type="button" onClick={(event) => handleDeleteImageButton(event, index)}><MdDelete /></button>
                                <img src={image} alt={`Image ${index}`} className="object-cover h-[30vw] sm:h-[25vw] xl:h-[15vw] w-[35vw] xl:w-[12vw]" />
                            </li>
                        ))}
                    </ul>

                    <input
                        className={`${inputClasses} w-[70vw] xl:w-[24vw] bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly`}
                        type="url"
                        name="image"
                        placeholder="Pega aquí la URL de la imagen"
                        title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg (Máximo 2 imágenes)"
                    />

                    <button className={`${btnClasses} bg-folly text-spring-bud mx-auto text-[9vw]/[100%] xl:text-[3vw]/[100%]`} type="submit"><MdSave /></button>
                </form>

                {/* ===== Tags ===== */}
                <form
                    className="
                        flex flex-col items-center
                        w-[80vw] xl:w-[28vw]
                        gap-[5vw] sm:gap-[6vw] xl:gap-[2vw]
                        my-[5vw] sm:my-[3vw] xl:my-[2vw]
                        py-[5vw] xl:py-[2vw]
                        bg-spring-bud
                        drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                    " onSubmit={handleTagFormSubmit}>
                    <label className={`${labelClasses} pb-[0.5vw] text-folly`} htmlFor="tag">Etiquetas</label>

                    <ul className="flex flex-wrap mx-[6vw] xl:mx-[2vw] gap-[4vw] xl:gap-[0.5vw]">
                        {(recipe.tags ?? []).map((tag, index) => (
                            <li className="flex flex-row items-center gap-[1vw] xl:gap-[0.2vw] text-spring-bud" key={index}>
                                <h3 className="
                                        bg-folly anybody-title
                                        flex items-center
                                        pt-[1vw] sm:pt-[0.5vw] xl:pt-[0.2vw]
                                        h-[6vw] sm:h-[5vw] xl:h-[2vw]
                                        px-[2vw] sm:px-[1.2vw]
                                        text-[3.5vw] sm:text-[3vw] xl:text-[1vw]
                                        drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                                    ">#{tag}</h3>
                                <button className="
                                        text-folly p-[0.5vw] cursor-pointer
                                        text-[7vw] sm:text-[6vw] lg:text-[5vw] xl:text-[2vw]
                                        transition-transform duration-150 ease-out
                                        hover:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] hover:xl:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.8)] hover:-translate-y-1 hover:scale-105
                                    " type="button" onClick={(event) => handleDeleteTagButton(event, index)}><MdDelete /></button>
                            </li>
                        ))}
                    </ul>

                    <input
                        className={`${inputClasses} w-[70vw] xl:w-[24vw] bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly placeholder:normal-case`}
                        type="text"
                        name="tag"
                        placeholder="Añade etiquetas a tu receta"
                        title="Solo letras minúsculas, números, guiones y guiones bajos. Sin espacios y máximo 30 caracteres"
                        pattern="^\s*[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9\-_']{1,30}\s*$"
                        style={{ textTransform: 'lowercase' }}
                        maxLength={30}
                    />
                    <button className={`${btnClasses} bg-folly text-spring-bud mx-auto text-[9vw]/[100%] xl:text-[3vw]/[100%]`} type="submit"><MdSave /></button>
                </form>

                {/* ===== Ingredients ===== */}
                <form className="
                        flex flex-col items-center bg-spring-bud
                        w-[80vw] xl:w-[28vw]
                        my-[5vw] sm:my-[3vw] xl:my-[1vw]
                        py-[5vw] xl:py-[0vw]
                        drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                    " onSubmit={handleIngredientFormSubmit}>
                    <h2 className="anybody-title text-folly pt-[3vw] xl:pt-[2vw] text-[6vw] xl:text-[2vw]">Ingredientes</h2>

                    <div>
                        <div>
                            {/* Main ingredients */}
                            {mainIngredients.length > 0 && (
                                <>
                                    <h3 className="
                                            w-[6em] mt-[6vw] xl:mt-[1.5vw] mb-[5vw] xl:mb-[2vw] mx-auto text-center
                                            anybody-title text-spring-bud font-bold pt-[0.1vw] bg-folly
                                            text-[4vw] sm:text-[3.5vw] xl:text-[1.2vw]
                                            drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                                        ">Principales</h3>
                                    <ul className="flex flex-col items-start gap-[3vw] sm:gap-[4vw] xl:sm:gap-[1vw] w-full">
                                        {mainIngredients.map((ingredient, index) => (
                                            <li key={index} className="flex flex-row items-start gap-[2vw] xl:gap-[1vw] px-[5vw] xl:px-[2vw] w-full text-folly">
                                                <button className="
                                                            text-[5vw] sm:text-[4vw] xl:text-[1.4vw]
                                                            self-start cursor-pointer transition-transform duration-150 ease-out
                                                            hover:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.7)] hover:-translate-y-1 hover:scale-105
                                                            " type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)}><MdDelete />
                                                </button>
                                                <p className="text-left text-[4vw]/[110%] sm:text-[3vw]/[110%] xl:text-[1.2vw]/[110%]">
                                                    <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                                    {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {/* Pantry ingredients */}
                            {pantryIngredients.length > 0 && (
                                <>
                                    <h3 className="
                                            w-[6em] mt-[6vw] xl:mt-[2vw] mb-[5vw] xl:mb-[2vw] mx-auto text-center
                                            anybody-title text-spring-bud font-bold pt-[0.1vw] bg-folly
                                            text-[4vw] sm:text-[3.5vw] xl:text-[1.2vw]
                                            drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                                        ">Despensa</h3>
                                    <ul className="flex flex-col items-start gap-[3vw] sm:gap-[4vw] xl:sm:gap-[1vw] w-full">
                                        {pantryIngredients.map((ingredient, index) => (
                                            <li key={index} className="flex flex-row items-start gap-[2vw] xl:gap-[1vw] px-[5vw] xl:px-[2vw] w-full text-folly">
                                                <button className="
                                                            text-[5vw] sm:text-[4vw] xl:text-[1.2vw]
                                                            self-start cursor-pointer transition-transform duration-150 ease-out
                                                            hover:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.7)] hover:-translate-y-1 hover:scale-105
                                                        " type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)}><MdDelete />
                                                </button>
                                                <p className="text-left text-[4vw]/[110%] sm:text-[3vw]/[110%] xl:text-[1.2vw]/[110%]">
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

                    {/* New ingredient */}
                    <div className="
                            flex flex-col py-[5vw] xl:py-[2vw] gap-[2vw] xl:gap-[1vw] w-[70vw] xl:w-[24vw] mt-[6vw] xl:mt-[2vw] mb-[1vw] xl:mb-[3vw] bg-folly
                            drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                        ">
                        <h3 className="flex justify-center anybody-title text-spring-bud text-[6vw] sm:text-[5vw] xl:text-[1.6vw]">Nuevo ingrediente</h3>

                        <div className="flex flex-col w-full items-center gap-[6vw] xl:gap-[2vw]">
                            <label className={`${labelClasses} text-spring-bud`} htmlFor="name">Nombre*</label>
                            <input
                                className={`${inputClasses} w-[60vw] xl:w-[20vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                                type="text"
                                name="name"
                                placeholder="Añade un nombre al ingrediente"
                                required
                                maxLength={50}
                                pattern="^\s*[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9\s\-_'(),.%/+&]{1,50}\s*$"
                                title="Solo letras, números, espacios y caracteres especiales como -_'(),.%/+&. Máximo 50 caracteres"
                            />
                            <div className="flex flex-row justify-between w-[60vw] xl:w-[20vw]">
                                <div className="flex flex-col gap-[6vw] xl:gap-[2vw]">
                                    <label className={`${labelClasses} text-spring-bud`} htmlFor="quantity">Cantidad*</label>
                                    <input
                                        className={`${inputClasses} w-[28vw] xl:w-[9vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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

                                <div className="flex flex-col gap-[6vw] xl:gap-[2vw]">
                                    <label className={`${labelClasses} text-spring-bud`} htmlFor="unit">Unidad*</label>
                                    <input
                                        className={`${inputClasses} w-[28vw] xl:w-[9vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                                        type="text"
                                        name="unit"
                                        placeholder="g, uds, ml..."
                                        pattern="^\s*[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\s*$"
                                        maxLength={20}
                                        title="Solo letras, espacios y tildes. Máximo 20 caracteres"
                                    />
                                </div>
                            </div>

                            <label className={`${labelClasses} text-spring-bud`} htmlFor="annotation">Anotación</label>
                            <input
                                className={`${inputClasses} w-[60vw] xl:w-[20vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                                type="text"
                                name="annotation"
                                placeholder="¿Necesitas alguna aclaración?"
                                maxLength={50}
                                title="Máximo 50 caracteres"
                            />

                            <div className="flex flex-row justify-around w-[60vw] xl:w-[20vw] items-center align-middle gap-[0.5vw]">
                                <label className="flex items-center justify-center anybody text-center text-[5vw] sm:text-[4vw] xl:sm:text-[1.2vw] font-bold text-spring-bud" htmlFor="main">¿Ingrediente principal?</label>
                                <input
                                    className="w-[4vw] h-[4vw] xl:w-[1.5vw] xl:h-[1.5vw] accent-spring-bud"
                                    type="checkbox"
                                    defaultChecked="true"
                                    name="main"
                                />
                            </div>
                        </div>

                        <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] xl:text-[3vw]/[100%]`} type="submit"><MdSave /></button>
                    </div>
                </form>

                {/* ===== Steps ===== */}
                <div className="
                        flex flex-col items-center bg-spring-bud w-[80vw] xl:w-[28vw] my-[5vw] sm:my-[3vw] xl:my-[1vw] py-[5vw] xl:py-[0vw]
                        drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                    ">
                    <h2 className="anybody-title text-folly pt-[3vw] xl:pt-[2vw] xl:pb-[1vw] text-[6vw] xl:text-[2vw]">Pasos</h2>

                    <ul className="flex flex-col items-center text-folly w-[70vw] xl:w-[24vw] justify-center text-center gap-[3vw] xl:gap-[0.5vw]">
                        {(recipe.steps ?? []).map((step, index) => (
                            <li className="flex flex-col items-center gap-[3vw] sm:gap-[4vw] xl:gap-[0.5vw] w-full" key={index}>
                                <h3 className="anybody-logo text-[5vw] xl:text-[1.6vw]">{index + 1}</h3>

                                {editStep === step.id ? (
                                    <form
                                        onSubmit={handleEditStepFormSubmit}
                                        className="flex flex-col w-full items-center gap-[6vw] xl:gap-[2vw]"
                                    >
                                        <label className={`${labelClasses} text-folly`} htmlFor="text">Instrucciones*</label>
                                        <textarea
                                            name="text"
                                            defaultValue={step.text}
                                            className={`${textareaClasses} w-[60vw] xl:w-[20vw] p-[4vw] xl:p-[1vw] bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly`}
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

                                        <label className={`${labelClasses} text-folly`} htmlFor="note">Nota</label>
                                        <textarea
                                            name="note"
                                            defaultValue={step.note}
                                            className={`${textareaClasses} w-[60vw] xl:w-[20vw] p-[4vw] xl:p-[1vw] bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly`}
                                            placeholder="¿Necesitas aclarar algo?"
                                            maxLength={500}
                                            title="Máximo 500 caracteres"
                                            onInput={(e) => {
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                            wrap="soft"
                                        />

                                        <label className={`${labelClasses} text-folly`} htmlFor="image">Imagen</label>
                                        <input
                                            name="image"
                                            type="url"
                                            defaultValue={step.image}
                                            placeholder="Pega aquí la url de la imagen"
                                            title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                                            className={`${inputClasses} w-[60vw] xl:w-[20vw] bg-folly text-spring-bud focus:bg-spring-bud focus:text-folly focus:outline-folly`}
                                        />

                                        <button className={`${btnClasses} bg-folly text-spring-bud mx-auto text-[9vw]/[100%] xl:text-[3vw]/[100%] mt-[2vw]`} type="submit"><MdSave /></button>
                                    </form>
                                ) : (
                                    <>
                                        <div className="text-[4vw]/[120%] sm:text-[3.5vw]/[120%] xl:text-[1.2vw]/[120%]">
                                            <strong>{step.text}</strong>
                                        </div>
                                        {step.note && (
                                            <div className="italic text-[3.5vw]/[120%] sm:text-[3vw]/[120%] xl:text-[1vw]/[120%]">
                                                {step.note}
                                            </div>
                                        )}
                                        {step.image && (
                                            <img
                                                src={step.image}
                                                alt={`Image ${index + 1}`}
                                                className="pt-[3vw] xl:pt-[1vw]"
                                            />
                                        )}
                                    </>
                                )}

                                <div className="flex flex-row items-center justify-center gap-[3vw] xl:gap-[1vw] w-full">
                                    <button
                                        className="
                                            text-[6vw] sm:text-[5vw] xl:text-[1.4vw] mt-[3vw] xl:mt-[0.5vw]
                                            transition-transform duration-150 ease-out cursor-pointer
                                            hover:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.7)] hover:-translate-y-1 hover:scale-105
                                        "
                                        type="button"
                                        onClick={() => setEditStep(editStep === step.id ? null : step.id)}
                                    >
                                        {editStep === step.id ? <IoMdCloseCircle /> : <MdEdit />}
                                    </button>

                                    <div className="flex flex-row items-center justify-center gap-[1.5vw] xl:gap-[0.5vw] bg-folly text-spring-bud px-[2vw] py-[1vw] xl:px-[0.5vw] xl:py-[0.3vw] mt-[3vw] xl:mt-[0.5vw] rounded-full">
                                        <button
                                            onClick={(event) => handleMoveStepUp(event, step.id)}
                                            disabled={index === 0}
                                            className="
                                                text-[5vw] sm:text-[4vw] xl:text-[1.4vw]
                                                transition-transform duration-150 ease-out cursor-pointer
                                                hover:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.7)] hover:-translate-y-1 hover:scale-105
                                                disabled:opacity-30 disabled:cursor-not-allowed
                                            "
                                        >
                                            <FaChevronUp />
                                        </button>
                                        <button
                                            onClick={(event) => handleMoveStepDown(event, step.id)}
                                            disabled={index === recipe.steps.length - 1}
                                            className="
                                                text-[5vw] sm:text-[4vw] xl:text-[1.4vw]
                                                transition-transform duration-150 ease-out cursor-pointer
                                                hover:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.7)] hover:-translate-y-1 hover:scale-105
                                                disabled:opacity-30 disabled:cursor-not-allowed
                                            "
                                        >
                                            <FaChevronDown />
                                        </button>
                                    </div>

                                    <button className="
                                                text-[6vw] sm:text-[5vw] xl:text-[1.4vw] mt-[3vw] xl:mt-[0.5vw]
                                                transition-transform duration-150 ease-out cursor-pointer
                                                hover:drop-shadow-[0.3vw_0.3vw_0_rgba(0,0,0,0.7)] hover:-translate-y-1 hover:scale-105
                                            "
                                        type="button"
                                        onClick={(event) => handleDeleteStepButton(event, step.id)}>
                                        <MdDelete />
                                    </button>
                                </div>

                                <div className="bg-folly h-[0.5vw] xl:h-[0.2vw] mt-[4vw] xl:mt-[0.5vw] mb-[2vw] xl:mb-[0.5vw] w-[70vw] xl:w-[24vw]"></div>
                            </li>
                        ))}
                    </ul>

                    {/* New Step */}
                    <form
                        onSubmit={handleStepFormSubmit}
                        className="
                            flex flex-col py-[5vw] xl:py-[2vw] gap-[3vw] xl:gap-[0vw] w-[70vw] xl:w-[24vw] mt-[6vw] xl:mt-[1vw] mb-[1vw] xl:mb-[2.5vw] bg-folly
                            drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
                        ">
                        <h3 className="flex justify-center anybody-title text-spring-bud text-[6vw] sm:text-[5vw] xl:text-[2vw]">Nuevo Paso</h3>

                        <div className="flex flex-col w-full items-center gap-[6vw] xl:gap-[2vw]" >
                            <label className={`${labelClasses} text-spring-bud`} htmlFor="text">Instrucciones*</label>
                            <textarea
                                className={`${textareaClasses} w-[60vw] xl:w-[20vw] p-[4vw] xl:p-[1vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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
                                className={`${textareaClasses} w-[60vw] xl:w-[20vw] p-[4vw] xl:p-[1vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
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
                                className={`${inputClasses} w-[60vw] xl:w-[20vw] bg-spring-bud text-folly focus:bg-folly focus:text-spring-bud focus:outline-spring-bud`}
                                type="url"
                                name="image"
                                placeholder="Pega aquí la url de la imagen"
                                title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                            />
                        </div>
                        <button className={`${btnClasses} bg-spring-bud text-folly mx-auto text-[9vw]/[100%] xl:text-[3vw]/[100%] mt-[2vw]`} type="submit"><MdSave /></button>
                    </form>
                </div>
            </main>

            {/* Buttons */}
            <div className="fixed bottom-0 left-0 overflow-hidden flex xl:justify-end w-full xl:w-[40vw] px-[8vw] xl:px-0 -mb-[1px] xl:-mb-0 xl:h-[55vh] py-[5vw] sm:py-[3vw] xl:py-0 bg-veronica">
                <div className="flex flex-row xl:flex-col justify-between xl:justify-center items-center xl:gap-[2vw] w-full xl:w-[20vw] h-full xl:pb-[2vw]">
                    <div className="flex flex-row xl:flex-col gap-[4vw] xl:gap-[2vw]">
                        <button
                            className={`${footerButtonClasses} pr-[0.15em]`}
                            onClick={handleSaveRecipeBackButton}
                        >
                            <FaChevronLeft />
                        </button>

                        <button
                            className={`${footerButtonClasses} pb-[0.05em]`}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            <FaChevronUp />
                        </button>
                    </div>

                    <div className="flex flex-row xl:flex-col gap-[4vw] xl:gap-[2vw]">
                        <button
                            className={footerButtonClasses}
                            type="button"
                            onClick={handleToRecipeClick}
                        >
                            <MdRemoveRedEye />
                        </button>

                        <button
                            className={footerButtonClasses}
                            type="button"
                            onClick={handleDeleteButtonClick}
                        >
                            <MdDelete />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
}

export default SaveRecipe