import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import logic from '../../../logic'
import { useAppContext } from '../../../context'
import handleCredentialsError from '../../../util/handleCredentialsError'
import type { Ingredient, Step, RecipeData } from '../../../types/recipe'

import Header from '../shared/Header'
import Footer from '../../components/Footer'

import RecipeActionBar from './components/RecipeActionBar'
import PublishedStatus from './components/PublishedStatus'
import BasicDataForm from './components/BasicDataForm'
import ImageSection from './components/ImageSection'
import TagSection from './components/TagSection'
import IngredientList from './components/IngredientList'
import NewIngredientForm from './components/NewIngredientForm'
import StepList from './components/StepList'
import NewStepForm from './components/NewStepForm'

interface SaveRecipeProps {
    view: string
    onToRecipeClicked: (recipeId: string) => void
    onRecipeDeleted: () => void
    onUserLoggedOut: () => void
}

function SaveRecipe({
    view,
    onToRecipeClicked,
    onRecipeDeleted,
    onUserLoggedOut,
}: SaveRecipeProps) {
    const { alert, confirm } = useAppContext()
    const navigate = useNavigate()
    const { id: recipeId } = useParams()

    const [recipe, setRecipe] = useState<RecipeData | null>(null)

    useEffect(() => {
        if (!recipeId) return
        let active = true

        Promise.resolve()
            .then(() => logic.getRecipeById(recipeId as string))
            .then((data: any) => { if (active) setRecipe(data) })
            .catch(error => {
                if (!active || handleCredentialsError(error, alert, onUserLoggedOut)) return
                alert(error.message)
                console.error(error)
            })

        return () => { active = false }
    }, [recipeId, alert, onUserLoggedOut])

    const [difficulty, setDifficulty] = useState(recipe?.difficulty || "")
    const [category, setCategory] = useState(recipe?.category || "")
    useEffect(() => {
        if (recipe && recipe.difficulty) {
            setDifficulty(recipe.difficulty)
        }
        if (recipe && recipe.category) {
            setCategory(recipe.category)
        }
    }, [recipe])

    const [editStep, setEditStep] = useState<string | null>(null)

    useEffect(() => {
        const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
            if (textarea) {
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight + 'px'
            }
        }

        const descriptionTextarea = document.querySelector('textarea[name="description"]')
        const textTextarea = document.querySelector('textarea[name="text"]')
        const noteTextarea = document.querySelector('textarea[name="note"]')

        adjustTextareaHeight(descriptionTextarea as HTMLTextAreaElement | null)
        adjustTextareaHeight(textTextarea as HTMLTextAreaElement | null)
        adjustTextareaHeight(noteTextarea as HTMLTextAreaElement | null)
    }, [recipe?.description, recipe?.steps])

    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleRecipeFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!recipe) return

        const form = event.currentTarget
        const title = ((form.title as unknown) as HTMLInputElement).value.trim()
        const rawDescription = form.description.value.trim()
        const description = rawDescription === '' ? null : rawDescription
        const rawTime = form.time.value.trim()
        const time = rawTime === '' ? undefined : Number(rawTime)
        const rawServings = form.servings.value.trim()
        const servings = rawServings === '' ? undefined : Number(rawServings)
        let difficulty = form.difficulty.value.trim().toLowerCase() || undefined
        const category = form.category.value.trim() || undefined

        if (!title) {
            alert('Añade un título a tu receta')
            return
        }

        const difficultyMap: Record<string, string> = {
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

        const hasChanges =
            title !== recipe.title ||
            description !== (recipe.description ?? null) ||
            time !== (recipe.time === 0 || recipe.time == null ? undefined : recipe.time) ||
            servings !== (recipe.servings === 0 || recipe.servings == null ? undefined : recipe.servings) ||
            difficulty !== recipe.difficulty ||
            category !== recipe.category

        if (!hasChanges) {
            alert('No hay cambios que guardar')
            return
        }

        logic.updateRecipe(recipe.id, title, description, time, difficulty, category, servings)
            .then(() => {
                setRecipe(prevRecipe => prevRecipe ? ({
                    ...prevRecipe,
                    title,
                    description,
                    time,
                    difficulty,
                    category,
                    servings
                }) : prevRecipe)

                alert('Receta actualizada')
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleImageFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!recipe) return

        const form = event.currentTarget
        const image = form.image.value.trim()

        if (!image) {
            alert('Añade la url de la imagen')
            return
        }

        logic.addImageToRecipe(recipe.id, image)
            .then(() => {
                setRecipe(prevRecipe => prevRecipe ? ({
                    ...prevRecipe,
                    images: [...(prevRecipe.images ?? []), image]
                }) : prevRecipe)
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

    const handleDeleteImageButton = (event: React.MouseEvent, index: number) => {
        event.preventDefault()

        if (!recipe) return

        confirm('¿Quieres eliminar esta imagen?', (accepted: boolean) => {
            if (accepted) {
                try {
                    logic.removeImageFromRecipe(recipe.id, index)
                        .then(() => {
                            setRecipe(prevRecipe => prevRecipe ? ({
                                ...prevRecipe,
                                images: prevRecipe.images.filter((image: string, index2: number) => index2 !== index)
                            }) : prevRecipe)
                        })
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert((error as Error).message)
                    console.error(error)
                }
            }
        })
    }

    const handleTagFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!recipe) return

        const form = event.currentTarget
        const tag = form.tag.value.trim().toLowerCase()

        if (!tag) {
            alert('Añade una etiqueta')
            return
        }

        logic.addTagToRecipe(recipe.id, tag)
            .then(() => {
                setRecipe(prevRecipe => prevRecipe ? ({
                    ...prevRecipe,
                    tags: [...(prevRecipe.tags ?? []), tag]
                }) : prevRecipe)
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

    const handleDeleteTagButton = (event: React.MouseEvent, index: number) => {
        event.preventDefault()

        if (!recipe) return

        confirm('¿Quieres eliminar esta etiqueta?', (accepted: boolean) => {
            if (accepted) {
                try {
                    logic.removeTagFromRecipe(recipe.id, index)
                        .then(() => {
                            setRecipe(prevRecipe => prevRecipe ? ({
                                ...prevRecipe,
                                tags: (prevRecipe.tags ?? []).filter((tag: string, index2: number) => index2 !== index)
                            }) : prevRecipe)
                        })
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert((error as Error).message)
                    console.error(error)
                }
            }
        })
    }

    const handleIngredientFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!recipe) return

        const form = event.currentTarget
        const name = ((form.name as unknown) as HTMLInputElement).value.trim()
        const quantity = parseFloat(form.quantity.value.trim())
        const unit = form.unit.value.trim()
        const annotation = form.annotation.value.trim() || undefined
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
            .then((ingredientId: string) => {
                const newIngredient: Ingredient = { id: ingredientId, name, quantity, unit, annotation, main }

                setRecipe(prevRecipe => prevRecipe ? ({
                    ...prevRecipe,
                    ingredients: [...(prevRecipe.ingredients ?? []), newIngredient],
                }) : prevRecipe)

                form.reset()
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleDeleteIngredientButton = (event: React.MouseEvent, ingredientId: string) => {
        event.preventDefault()

        if (!recipe) return

        confirm('¿Quieres eliminar este ingrediente?', (accepted: boolean) => {
            if (accepted) {
                try {
                    logic.removeIngredientFromRecipe(recipe.id, ingredientId)
                        .then(() => {
                            setRecipe(prevRecipe => prevRecipe ? ({
                                ...prevRecipe,
                                ingredients: prevRecipe.ingredients.filter((ingredient: Ingredient) => ingredient.id !== ingredientId)
                            }) : prevRecipe)
                        })
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert((error as Error).message)
                    console.error(error)
                }
            }
        })
    }

    const handleStepFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!recipe) return

        const form = event.currentTarget
        const text = form.text.value.trim()
        const note = form.note.value.trim() || undefined
        const image = form.image.value.trim() || undefined

        if (!text) {
            alert('El nuevo paso debe tener instrucciones')
            return
        }

        logic.addStepToRecipe(recipe.id, text, note, image)
            .then((stepId: string) => {
                const newStep: Step = { id: stepId, text, note, image }

                setRecipe(prevRecipe => prevRecipe ? ({
                    ...prevRecipe,
                    steps: [...(prevRecipe.steps ?? []), newStep],
                }) : prevRecipe)

                form.reset()
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleEditStepFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!recipe || !editStep) return

        const form = event.currentTarget
        const text = form.text.value.trim()
        const note = form.note.value.trim() || undefined
        const image = form.image.value.trim() || undefined

        if (!text) {
            alert('El paso debe tener instrucciones')
            return
        }

        confirm('¿Quieres guardar los cambios en este paso?', (accepted: boolean) => {
            if (!accepted) return

            try {
                logic.updateStep(recipe.id, editStep, text, note, image)
                    .then(() => {
                        setRecipe(prevRecipe => prevRecipe ? ({
                            ...prevRecipe,
                            steps: prevRecipe.steps.map((step: Step) =>
                                step.id === editStep
                                    ? { ...step, text, note, image }
                                    : step
                            )
                        }) : prevRecipe)

                        setEditStep(null)
                    })
                    .catch(error => {
                        alert(error.message)
                        console.error(error)
                    })
            } catch (error) {
                alert((error as Error).message)
                console.error(error)
            }
        })
    }

    const handleDeleteStepButton = (event: React.MouseEvent, stepId: string) => {
        event.preventDefault()

        if (!recipe) return

        confirm('¿Quieres eliminar este paso?', (accepted: boolean) => {
            if (accepted) {
                try {
                    logic.removeStepFromRecipe(recipe.id, stepId)
                        .then(() => {
                            setRecipe(prevRecipe => prevRecipe ? ({
                                ...prevRecipe,
                                steps: prevRecipe.steps
                                    .filter((step: Step) => step.id !== stepId)
                                    .map((step: Step, index: number) => ({
                                        ...step,
                                        order: index
                                    }))
                            }) : prevRecipe)
                        })
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert((error as Error).message)
                    console.error(error)
                }
            }
        })
    }

    const handleMoveStepUp = (event: React.MouseEvent, stepId: string) => {
        event.preventDefault()

        if (!recipe) return

        const stepIndex = recipe.steps.findIndex((step: Step) => step.id === stepId)
        if (stepIndex > 0) {
            try {
                logic.reorderStep(recipe.id, stepId, 'up')
                    .then(() => {
                        setRecipe(prevRecipe => {
                            if (!prevRecipe) return prevRecipe
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
                alert((error as Error).message)
                console.error(error)
            }
        }
    }

    const handleMoveStepDown = (event: React.MouseEvent, stepId: string) => {
        event.preventDefault()

        if (!recipe) return

        const stepIndex = recipe.steps.findIndex((step: Step) => step.id === stepId)
        if (stepIndex < recipe.steps.length - 1) {
            try {
                logic.reorderStep(recipe.id, stepId, 'down')
                    .then(() => {
                        setRecipe(prevRecipe => {
                            if (!prevRecipe) return prevRecipe
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
                alert((error as Error).message)
                console.error(error)
            }
        }
    }

    const handleToRecipeClick = (event: React.MouseEvent) => {
        event.preventDefault()

        if (recipe) onToRecipeClicked(recipe.id)
    }

    const handleDeleteButtonClick = () => {
        if (!recipe) return
        confirm('¿Quieres borrar esta receta?', (accepted: boolean) => {
            if (accepted) {
                try {
                    logic.deleteRecipe(recipe.id)
                        .then(() => onRecipeDeleted())
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert((error as Error).message)
                    console.error(error)
                }
            }
        })
    }

    const handlePublishButtonClick = () => {
        if (!recipe || !recipeId) return
        const message = recipe.published
            ? '¿Quieres pasar esta receta a borrador?'
            : '¿Quieres publicar esta receta?'

        confirm(message, (accepted: boolean) => {
            if (!accepted) return

            logic.togglePublishRecipe(recipeId)
                .then(({ published }: { published: boolean }) => {
                    setRecipe(prev => prev ? ({ ...prev, published }) : prev)
                    alert(published ? '¡Receta publicada!' : 'Receta guardada como borrador')
                })
                .catch(error => {
                    alert(error.message)
                    console.error(error)
                })
        })
    }

    if (!recipe) return <p>Cargando receta...</p>

    const mainIngredients = (recipe.ingredients ?? []).filter((ingredient: Ingredient) => ingredient.main)
    const pantryIngredients = (recipe.ingredients ?? []).filter((ingredient: Ingredient) => !ingredient.main)

    // style classes -->
    const inputBase = `
        w-full text-sm md:text-base text-center py-1 sm:py-2 md:py-3 px-4 rounded-full
        placeholder:italic placeholder:opacity-70
        shadow-hard-md xl:shadow-hard-lg
    `
    const labelBase = `text-base md:text-lg font-bold`

    const inputColor: Record<string, string> = {
        springBud: `text-folly bg-spring-bud placeholder:text-folly`,
        folly: `text-spring-bud bg-folly placeholder:text-spring-bud`
    }

    const btnColor: Record<string, string> = {
        springBud: `bg-spring-bud text-folly hover:outline-spring-bud hover:bg-folly hover:text-spring-bud`,
        folly: `bg-folly text-spring-bud hover:outline-folly hover:bg-spring-bud hover:text-folly`
    }

    const sectionBase = `flex flex-col w-full items-center gap-8 md:gap-12 px-8 md:px-12 xl:px-14 2xl:px-16 max-w-6xl`

    return <div className="flex flex-col min-h-screen w-full bg-folly">
        <Header
            variant='saveRecipe'
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="flex flex-col w-full max-w-6xl items-center mx-auto pt-32 xs:pt-36 lg:pt-32 xl:pt-36 pb-24 xs:pb-28 sm:pb-32 gap-2">

            <RecipeActionBar
                onToRecipeClicked={() => handleToRecipeClick({ preventDefault: () => {} } as React.MouseEvent)}
                onDeleteClicked={handleDeleteButtonClick}
            />

            <h1 className="anybody-logo text-2xl xs:text-3xl md:text-4xl xl:text-6xl text-spring-bud drop-shadow-hard-md pt-8">
                {view === "update" ? "Edita tu receta" : "Crea tu nueva receta"}
            </h1>

            <PublishedStatus
                published={recipe.published}
                onTogglePublish={handlePublishButtonClick}
            />

            <div className="flex w-full my-4 lg:my-6 items-center border-t-2 border-spring-bud" aria-hidden="true"></div>

            {/* <-- recipe intro --> */}
            <section aria-labelledby='recipe-intro' className={sectionBase}>
                <h2 id="recipe-intro" className="pt-2 anybody-logo text-2xl sm:text-3xl xl:text-4xl text-spring-bud drop-shadow-hard-sm xl:drop-shadow-hard-md">Introducción</h2>
                <p className="text-spring-bud text-base lg:text-lg leading-tight text-center font-semibold">Preséntanos a tu receta, puedes añadir etiquetas y hasta dos imágenes.</p>

                <BasicDataForm
                    title={recipe.title}
                    description={recipe.description ?? ''}
                    time={recipe.time}
                    servings={recipe.servings}
                    difficulty={difficulty}
                    category={category}
                    onDifficultyChange={setDifficulty}
                    onCategoryChange={setCategory}
                    onSubmit={handleRecipeFormSubmit}
                    inputBase={inputBase}
                    labelBase={labelBase}
                    inputColor={inputColor}
                    btnColor={btnColor}
                />

                <div className="flex w-full items-center border-t-2 border-spring-bud" aria-hidden="true"></div>

                <ImageSection
                    images={recipe.images ?? []}
                    onDeleteImage={(index) => handleDeleteImageButton({ preventDefault: () => {} } as React.MouseEvent, index)}
                    onSubmit={handleImageFormSubmit}
                    inputBase={inputBase}
                    labelBase={labelBase}
                    inputColor={inputColor}
                    btnColor={btnColor}
                />

                <div className="flex w-full items-center border-t-2 border-spring-bud" aria-hidden="true"></div>

                <TagSection
                    tags={recipe.tags ?? []}
                    onDeleteTag={(index) => handleDeleteTagButton({ preventDefault: () => {} } as React.MouseEvent, index)}
                    onSubmit={handleTagFormSubmit}
                    inputBase={inputBase}
                    labelBase={labelBase}
                    inputColor={inputColor}
                    btnColor={btnColor}
                />
            </section>

            {/* <-- ingredients --> */}
            <section aria-labelledby='ingredients' className={`${sectionBase} bg-spring-bud py-8 md:py-10`}>
                <h2 id="ingredients" className="anybody-logo text-2xl sm:text-3xl xl:text-4xl text-folly drop-shadow-hard-sm xl:drop-shadow-hard-md">Ingredientes</h2>
                <p className="text-folly text-base lg:text-lg leading-tight text-center font-semibold">Añade ingredientes a tu receta, puedes elegir entre ingredientes <strong>principales</strong> o de <strong>despensa</strong> (sal, pimienta...).</p>

                <IngredientList
                    mainIngredients={mainIngredients}
                    pantryIngredients={pantryIngredients}
                    onDeleteIngredient={(ingredientId) => handleDeleteIngredientButton({ preventDefault: () => {} } as React.MouseEvent, ingredientId)}
                />

                <NewIngredientForm
                    onSubmit={handleIngredientFormSubmit}
                    inputBase={inputBase}
                    labelBase={labelBase}
                    inputColor={inputColor}
                    btnColor={btnColor}
                />
            </section>

            {/* <-- steps --> */}
            <section aria-labelledby='steps' className={`${sectionBase} py-6 text-spring-bud`}>
                <h2 id="steps" className="anybody-logo text-2xl sm:text-3xl xl:text-4xl mx-auto drop-shadow-hard-sm xl:drop-shadow-hard-md">Pasos</h2>
                <p className="text-base lg:text-lg leading-tight text-center font-semibold">Añade los pasos necesarios para tu receta, también puedes <strong>editarlos y ordenarlos</strong> con los botones de cada paso.</p>

                <StepList
                    steps={recipe.steps ?? []}
                    editStep={editStep}
                    inputBase={inputBase}
                    labelBase={labelBase}
                    inputColor={inputColor}
                    btnColor={btnColor}
                    onEditToggle={(stepId) => setEditStep(editStep === stepId ? null : stepId)}
                    onMoveUp={(stepId) => handleMoveStepUp({ preventDefault: () => {} } as React.MouseEvent, stepId)}
                    onMoveDown={(stepId) => handleMoveStepDown({ preventDefault: () => {} } as React.MouseEvent, stepId)}
                    onDelete={(stepId) => handleDeleteStepButton({ preventDefault: () => {} } as React.MouseEvent, stepId)}
                    onEditSubmit={handleEditStepFormSubmit}
                />

                <NewStepForm
                    onSubmit={handleStepFormSubmit}
                    inputBase={inputBase}
                    labelBase={labelBase}
                    inputColor={inputColor}
                    btnColor={btnColor}
                />
            </section>

            <div className="flex w-full my-4 lg:my-6 items-center border-t-2 border-spring-bud" aria-hidden="true"></div>

            <PublishedStatus
                published={recipe.published}
                onTogglePublish={handlePublishButtonClick}
            />
        </main>

        <Footer></Footer>
    </div>
}

export default SaveRecipe
