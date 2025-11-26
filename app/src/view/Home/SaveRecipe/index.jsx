import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { MdDelete, MdEdit, MdSave, MdRemoveRedEye } from 'react-icons/md'
import { FaChevronUp, FaChevronDown, FaChevronLeft } from 'react-icons/fa'
import { IoMdCloseCircle } from 'react-icons/io'

import logic from '../../../logic'
import { useAppContext } from '../../../context'

import Header from '../common/Header'
import MiniCircleButton from '../common/MiniCircleButton'
import CircleButton from '../../common/CircleButton'
import Footer from '../../common/Footer'

function SaveRecipe({
    view,
    onToRecipeClicked,
    onRecipeDeleted,
    onUserLoggedOut,
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

    // style classes -->
    const inputBase = `
        w-full text-sm md:text-base text-center py-1 sm:py-2 md:py-3 px-4 rounded-full
        placeholder:italic placeholder:opacity-70
        shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]
    `
    const labelBase = `text-base md:text-lg font-bold`

    const inputColor = {
        springBud: `text-folly bg-spring-bud placeholder:text-folly`,
        folly: `text-spring-bud bg-folly placeholder:text-spring-bud`
    }

    const btnColor = {
        springBud: `bg-spring-bud text-folly hover:outline hover:outline-spring-bud hover:bg-folly hover:text-spring-bud`,
        folly: `bg-folly text-spring-bud hover:outline hover:outline-folly hover:bg-spring-bud hover:text-folly`
    }

    const h3Base = `mx-auto px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-sm shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]`

    const stepButton = `text-xl sm:text-2xl transition-transform duration-150 ease-out cursor-pointer hover:-translate-y-1 hover:scale-105`

    const sectionBase = `flex flex-col w-full items-center gap-8 md:gap-12 px-8 md:px-12 xl:px-14 max-w-7xl`

    return <div className="flex flex-col min-h-screen w-full bg-folly">
        <Header
            variant='saveRecipe'
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="flex flex-col w-full max-w-7xl items-center mx-auto pt-14 xs:pt-20 lg:pt-32 xl:pt-32 pb-24 xs:pb-28 sm:pb-32 gap-2">

            {/* <-- button group --> */}
            <section
                aria-labelledby="recipe-action-title"
                className="z-20 w-full flex items-center justify-center fixed left-0 top-16 xs:top-20 py-4 bg-spring-bud border-b-4 border-b-folly h-16">
                <h2 id="recipe-actions-title" className="sr-only">
                    Botonera de acciones y navegación de la receta
                </h2>

                <div className="flex justify-between px-8 md:px-12 xl:px-14 w-full max-w-7xl">
                    <nav className='flex gap-3 xs:gap-4'>
                        <MiniCircleButton to="/my-recipes" variant="saveRecipe" title="Atrás" className="pr-1">
                            <FaChevronLeft />
                        </MiniCircleButton>

                        <MiniCircleButton onClick={(e) => {
                            window.scrollTo({ top: 0, behavior: "smooth" })
                            e.currentTarget.blur()
                        }} variant="saveRecipe">
                            <FaChevronUp />
                        </MiniCircleButton>
                    </nav>

                    <div className='flex gap-3 xs:gap-4' role="toolbar" aria-label="Acciones de receta">
                        <MiniCircleButton onClick={handleToRecipeClick} aria-label="Ver receta" variant="saveRecipe">
                            <MdRemoveRedEye />
                        </MiniCircleButton>

                        <MiniCircleButton onClick={handleDeleteButtonClick} aria-label="Eliminar receta" variant="saveRecipe">
                            <MdDelete />
                        </MiniCircleButton>
                    </div>
                </div>
            </section>

            <h1 className="anybody-logo text-2xl xs:text-3xl md:text-4xl xl:text-6xl text-spring-bud drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)] pt-24 lg:pt-12">
                {view === "update" ? "Edita tu receta" : "Crea tu nueva receta"}
            </h1>

            <div className="flex w-full my-4 lg:my-6 items-center border-t-2 border-spring-bud" aria-hidden="true"></div>

            {/* <-- recipe intro --> */}
            <section
                aria-labelledby='recipe-intro' className={sectionBase}>

                <h2 id="recipe-intro" className="anybody-logo text-2xl sm:text-3xl xl:text-4xl text-spring-bud drop-shadow-[0.2rem_0.2rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)">Introducción</h2>

                {/* <-- basic data --> */}
                <section aria-labelledby="basic-data-title" className="flex flex-col w-full items-center text-center py-2 gap-2">
                    <h3 id="basic-data-title" className={`${h3Base} text-folly bg-spring-bud`}>Datos básicos</h3>

                    <form className="flex flex-col w-full items-center gap-2 md:gap-4 text-spring-bud" onSubmit={handleRecipeFormSubmit}>

                        <label className={labelBase} htmlFor="title">Título*</label>
                        <input
                            id="title" type="text" name="title" required
                            placeholder="Pon un título a tu receta"
                            defaultValue={recipe.title} maxLength={50}
                            title="Campo obligatorio. Máximo 50 caracteres"

                            className={`${inputBase} ${inputColor.springBud} mb-2 truncate`}
                        />

                        <label className={labelBase} htmlFor="description">Descripción</label>
                        <textarea
                            id="description" name="description" title="Máximo 500 caracteres" placeholder="Describe tu receta ¡cuéntanos más!"
                            defaultValue={recipe.description} maxLength={500} wrap="soft"
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}

                            className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight mb-2 px-3 `}
                        />

                        <div className="flex flex-row w-full justify-between gap-4">
                            <div className="flex flex-col w-full gap-2">
                                <label className={labelBase} htmlFor="time">Tiempo</label>
                                <input
                                    id="time" type="number" name="time" title="Tiempo en minutos. Múltiplos de 5"
                                    placeholder="En minutos" defaultValue={recipe.time || 5} min={5} max={9999} step={5}

                                    className={`${inputBase} ${inputColor.springBud} truncate mb-2`}
                                />
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <label className={labelBase} htmlFor="difficulty">Dificultad</label>
                                <select
                                    id="difficulty" name="difficulty" value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}

                                    className={`${inputBase} ${inputColor.springBud} flex items-center justify-center mb-2`}
                                >
                                    <option value="">- Selecciona -</option>
                                    <option value="easy">Fácil</option>
                                    <option value="medium">Media</option>
                                    <option value="difficult">Difícil</option>
                                </select>
                            </div>
                        </div>

                        <CircleButton type="submit" variant="saveRecipe" className={`${btnColor.springBud} mt-2`}>
                            <MdSave />
                        </CircleButton>
                    </form>
                </section>

                <div className="flex w-full items-center border-t-2 border-spring-bud" aria-hidden="true"></div>

                {/* <-- images --> */}
                <section aria-labelledby="images-title" className="flex flex-col w-full mx-auto py-2 gap-4">
                    <h3 id="images-title" className={`${h3Base} text-folly bg-spring-bud`}>Imágenes</h3>

                    <ul className="flex gap-6 w-full py-4 justify-center">
                        {(recipe.images ?? []).map((image, index) => (
                            <li className="relative shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)] w-1/2" key={index}>

                                <MiniCircleButton type="button" onClick={(event) => handleDeleteImageButton(event, index)} variant="recipe" className="absolute right-2 top-2"><MdDelete /></MiniCircleButton>

                                <img src={image} alt={`Image ${index}`} className="object-cover aspect-square h-full lg:max-h-96 w-full" />
                            </li>
                        ))}
                    </ul>

                    <form className="flex flex-col w-full mx-auto items-center gap-2 md:gap-4 text-spring-bud" onSubmit={handleImageFormSubmit}>
                        <label className={labelBase} htmlFor="image">URL de imagen</label>
                        <input
                            id="image" type="url" name="image" title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg (Máximo 2 imágenes)"
                            placeholder="Pega aquí la URL de la imagen"

                            className={`${inputBase} ${inputColor.springBud} truncate`}
                        />

                        <CircleButton type="submit" variant="saveRecipe" className={`${btnColor.springBud} mt-4`}>
                            <MdSave />
                        </CircleButton>
                    </form>
                </section>

                <div className="flex w-full items-center border-t-2 border-spring-bud" aria-hidden="true"></div>

                {/* <-- tags -> */}
                <section aria-labelledby="tags-title" className="flex flex-col w-full mx-auto pt-2 pb-6 gap-4">
                    <h3 id="tags-title" className={`${h3Base} text-folly bg-spring-bud`}>Etiquetas</h3>

                    <ul className="flex flex-wrap w-full justify-center gap-x-4 md:gap-x-6 gap-y-2">
                        {(recipe.tags ?? []).map((tag, index) => (
                            <li className="flex flex-row items-center align-middle text-folly gap-2" key={index}>
                                <span className="
                                        rounded-sm anybody-title text-xs sm:text-sm lg:text-base xl:text-lg pb-0.5 pt-1 px-2 bg-spring-bud shadow-[0.2rem_0.2rem_0_0_rgba(0,0,0,0.8)] xs:shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)]
                                    ">#{tag}</span>

                                <MiniCircleButton type="button" onClick={(event) => handleDeleteTagButton(event, index)} variant="recipe"><MdDelete /></MiniCircleButton>
                            </li>
                        ))}
                    </ul>

                    <form
                        className="flex flex-col w-full items-center gap-2 md:gap-4 text-spring-bud pt-2" onSubmit={handleTagFormSubmit}>

                        <label className={labelBase} htmlFor="tag">Nueva etiqueta</label>
                        <input
                            id="tag" type="text" name="tag" title="Solo letras minúsculas, números, guiones y guiones bajos. Sin espacios y máximo 30 caracteres" placeholder="Añade etiquetas a tu receta" pattern="^\s*[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9\-_']{1,30}\s*$" maxLength={30} style={{ textTransform: 'lowercase' }}

                            className={`${inputBase} ${inputColor.springBud} placeholder:normal-case mb-2`}
                        />

                        <CircleButton type="submit" variant="saveRecipe" className={`${btnColor.springBud} mt-2`}>
                            <MdSave />
                        </CircleButton>
                    </form>
                </section>
            </section>

            {/* <-- ingredients --> */}
            <section aria-labelledby='ingredients' className={`${sectionBase} bg-spring-bud py-8 md:py-10`}>
                <h2 id="ingredients" className="anybody-logo text-2xl sm:text-3xl xl:text-4xl text-folly drop-shadow-[0.2rem_0.2rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)">Ingredientes</h2>

                <div className="columns-1 lg:columns-2 gap-6 space-y-6">
                    {/* <-- main ingredients --> */}
                    {mainIngredients.length > 0 && (
                        <section aria-labelledby="main-ingredients" className="flex flex-col py-2 gap-2">
                            <h3 id="main-ingredients" className={`${h3Base} text-spring-bud bg-folly`}>Principales</h3>

                            <ul className="flex flex-col gap-2">
                                {mainIngredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center gap-3 xs:gap-4 text-folly">
                                        <MiniCircleButton type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)} variant="saveRecipe" className="shrink-0"><MdDelete /></MiniCircleButton>

                                        <p className="text-sm sm:text-base leading-tight">
                                            <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                            {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* <-- pantry ingredients --> */}
                    {pantryIngredients.length > 0 && (
                        <section aria-labelledby="pantry-ingredients" className="flex flex-col py-2 gap-2">
                            <h3 id="pantry-ingredients" className={`${h3Base} text-spring-bud bg-folly`}>Despensa</h3>

                            <ul className="flex flex-col gap-2">
                                {pantryIngredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center gap-3 xs:gap-4 text-folly">
                                        <MiniCircleButton type="button" onClick={(event) => handleDeleteIngredientButton(event, ingredient.id)} variant="saveRecipe" className="shrink-0"><MdDelete /></MiniCircleButton>

                                        <p className="text-sm sm:text-base leading-tight">
                                            <span className="font-extrabold">{ingredient.name} ·</span> <span>{ingredient.quantity}</span> <span>{ingredient.unit}</span>
                                            {ingredient.annotation && <span className="italic font-light"> ({ingredient.annotation})</span>}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* <-- new ingredient --> */}
                <form onSubmit={handleIngredientFormSubmit} className="flex flex-col w-full items-center mx-auto gap-2 md:gap-4 text-folly">
                    <h3 className={`${h3Base} text-spring-bud bg-folly`}>Nuevo ingrediente</h3>

                    <label className={labelBase} htmlFor="name">Nombre*</label>
                    <input
                        id="name" type="text" name="name" required title="Solo letras, números, espacios y caracteres especiales como -_'(),.%/+&. Máximo 50 caracteres" autocomplete="off"
                        placeholder="Añade un nombre al ingrediente" maxLength={50} pattern="^\s*[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9\s\-_'(),.%/+&]{1,50}\s*$"

                        className={`${inputBase} ${inputColor.folly} mb-2`}
                    />
                    <div className="flex flex-row gap-4 pb-2 w-full">
                        <div className="flex flex-col w-full gap-2">
                            <label className={`${labelBase} text-center`} htmlFor="quantity">Cantidad*</label>
                            <input
                                id="quantity" type="number" name="quantity" title="Introduce una cantidad entre 0 y 9999, hasta 2 decimales con punto (ej. 1.55)" placeholder="Número"
                                min={0} max={9999} step={0.01} inputMode="decimal"

                                className={`${inputBase} ${inputColor.folly}`}
                            />
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <label className={`${labelBase} text-center`} htmlFor="unit">Unidad*</label>
                            <input
                                id="unit" type="text" name="unit" title="Solo letras, espacios y tildes. Máximo 20 caracteres" placeholder="g, uds, ml..."
                                pattern="^\s*[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\s*$" maxLength={20}

                                className={`${inputBase} ${inputColor.folly}`}
                            />
                        </div>
                    </div>

                    <label className={labelBase} htmlFor="annotation">Anotación</label>
                    <input
                        id="annotation" type="text" name="annotation" title="Máximo 50 caracteres" maxLength={50}
                        placeholder="¿Necesitas alguna aclaración?"

                        className={`${inputBase} ${inputColor.folly} mb-2`}
                    />

                    <div className="flex flex-row items-center gap-2 pt-2">
                        <label className={labelBase} htmlFor="main">¿Ingrediente principal?</label>
                        <input id="main" type="checkbox" defaultChecked="true" name="main" className="size-4 accent-folly" />
                    </div>

                    <CircleButton type="submit" variant="saveRecipe" className={`${btnColor.folly} mt-2`}>
                        <MdSave />
                    </CircleButton>
                </form>
            </section>

            {/* <-- steps --> */}
            <section aria-labelledby='steps' className={`${sectionBase} py-6 text-spring-bud`}>
                <h2 id="steps" className="anybody-logo text-2xl sm:text-3xl xl:text-4xl mx-auto drop-shadow-[0.2rem_0.2rem_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.3rem_0.3rem_0_rgba(0,0,0,0.8)">Pasos</h2>

                <ol className="columns-1 lg:columns-2 lg:gap-6">
                    {(recipe.steps ?? []).map((step, index) => (
                        <li className="flex flex-col text-center gap-2" key={index}>
                            <h3 className="anybody-logo text-lg sm:text-xl">{index + 1}</h3>

                            {/* --> step edition form <-- */}
                            {editStep === step.id ? (
                                <form
                                    onSubmit={handleEditStepFormSubmit}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <label className={labelBase} htmlFor={`text-${step.id}`}>Instrucciones*</label>
                                    <textarea
                                        id={`text-${step.id}`} name="text" defaultValue={step.text} title="Máximo 800 caracteres" required wrap="soft" maxLength={800}
                                        placeholder="Añade las instrucciones del paso"
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}

                                        className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight mb-2 py-2 px-3`}
                                    />

                                    <label className={labelBase} htmlFor={`note-${step.id}`}>Nota</label>
                                    <textarea
                                        id={`note-${step.id}`} name="note" defaultValue={step.note} title="Máximo 500 caracteres" wrap="soft" maxLength={500}
                                        placeholder="¿Necesitas aclarar algo?"
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}

                                        className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight mb-2 py-2 px-3`}
                                    />

                                    <label className={labelBase} htmlFor={`image-${step.id}`}>Imagen</label>
                                    <input
                                        id={`image-${step.id}`} name="image" type="url" defaultValue={step.image} title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                                        placeholder="Pega aquí la url de la imagen"

                                        className={`${inputBase} ${inputColor.springBud} mb-2`}
                                    />

                                    <CircleButton type="submit" variant="saveRecipe" className={`${btnColor.springBud} mt-2`}>
                                        <MdSave />
                                    </CircleButton>
                                </form>
                            ) : (
                                <>
                                    {/* --> step <-- */}
                                    <div className="text-sm sm:text-base leading-tight">
                                        <strong>{step.text}</strong>
                                    </div>
                                    {step.note && (
                                        <div className="italic text-xs sm:text-sm leading-tight">
                                            {step.note}
                                        </div>
                                    )}
                                    {step.image && (
                                        <img
                                            src={step.image}
                                            alt={`Image ${index + 1}`}
                                            className="my-2 sm:my-3 rounded-sm object-contain max-h-64 md:max-h-72 mx-auto shadow-[0.3rem_0.3rem_0_0_rgba(0,0,0,0.8)] xl:shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]"
                                        />
                                    )}
                                </>
                            )}

                            {/* --> step buttons <-- */}
                            <div className="flex flex-row mx-auto gap-4 mt-2">
                                <button type="button" onClick={() => setEditStep(editStep === step.id ? null : step.id)} className={`${stepButton}`}>
                                    {editStep === step.id ? <IoMdCloseCircle /> : <MdEdit />}
                                </button>

                                <div className="flex flex-row  gap-2 rounded-full">
                                    <button onClick={(event) => handleMoveStepUp(event, step.id)} disabled={index === 0} className={`${stepButton} disabled:opacity-30 disabled:cursor-not-allowed`}>
                                        <FaChevronUp />
                                    </button>

                                    <button onClick={(event) => handleMoveStepDown(event, step.id)} disabled={index === recipe.steps.length - 1} className={`${stepButton} disabled:opacity-30 disabled:cursor-not-allowed`}>
                                        <FaChevronDown />
                                    </button>
                                </div>

                                <button type="button" onClick={(event) => handleDeleteStepButton(event, step.id)} className={`${stepButton}`}>
                                    <MdDelete />
                                </button>
                            </div>

                            <div
                                className="flex w-full my-4 border-t-2 border-spring-bud"
                                aria-hidden="true"
                            ></div>
                        </li>
                    ))}
                </ol>

                {/* <-- new step --> */}
                <form onSubmit={handleStepFormSubmit} className="flex flex-col w-full mx-auto items-center gap-2 md:gap-4 lg:gap-2">
                    <h3 className={`${h3Base} text-folly bg-spring-bud`}>Nuevo Paso</h3>

                    <div className="columns-1 lg:columns-2 gap-2 lg:gap-6 text-center w-full">
                        <label className={labelBase} htmlFor="text">Instrucciones*</label>
                        <textarea
                            id="text" name="text" title="Máximo 800 caracteres" required wrap="soft" maxLength={800}
                            placeholder="Añade las instrucciones del paso"
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}

                            className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight my-2 py-2 px-3`}
                        />

                        <label className={labelBase} htmlFor="note">Nota</label>
                        <textarea
                            id="note" name="note" title="Máximo 500 caracteres" wrap="soft" maxLength={500}
                            placeholder="¿Necesitas aclarar algo?"
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}

                            className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight my-2 py-2 px-3`}
                        />
                    </div>

                    <label className={labelBase} htmlFor="image">Imagen</label>
                    <input
                        type="url" name="image" title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                        placeholder="Pega aquí la url de la imagen"

                        className={`${inputBase} ${inputColor.springBud} mb-2`}
                    />

                    <CircleButton type="submit" variant="saveRecipe" className={`${btnColor.springBud} mt-2`}>
                        <MdSave />
                    </CircleButton>
                </form>
            </section>
        </main>

        <Footer></Footer>
    </div>
}

export default SaveRecipe