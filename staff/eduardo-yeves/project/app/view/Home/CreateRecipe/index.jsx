import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'

import Header from '../common/Header'

import logic from '../../../logic'

// import { useAppContext } from '../../context'

function CreateRecipe() {
    // const { alert } = useAppContext()
    const { id: recipeId } = useParams()
    console.log(recipeId)

    const [recipe, setRecipe] = useState(null)
    const [tag, setTag] = useState('')
    const [image, setImage] = useState('')

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

    const handleTagsFormSubmit = (event) => {
        event.preventDefault()

        const tag = event.target.tag.value.trim()

        if (!tag) return // Evita enviar etiquetas vacías

        logic.addTagToRecipe(recipe._id, tag)
            .then(() => {
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    tags: [...(prevRecipe.tags ?? []), tag] // Asegura que tags sea un array
                }))
                setTag("") // Limpiar el input después de agregar la etiqueta
            })
            .catch(error => {
                alert(error.message)

                console.error(error)
            })
    }

    const handleImagesFormSubmit = (event) => {
        event.preventDefault()

        const image = event.target.image.value.trim()

        if (!image) return // Evita enviar etiquetas vacías

        logic.addImageToRecipe(recipe._id, image)
            .then(() => {
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    images: [...(prevRecipe.images ?? []), image] // Asegura que images sea un array
                }))
                setImage("") // Limpiar el input después de agregar la imagen
            })
            .catch(error => {
                alert(error.message)

                console.error(error)
            })
    }

    const handleIngredientsFormSubmit = (event) => {
        event.preventDefault();

        const name = event.target.name.value.trim()
        const quantity = parseFloat(event.target.quantity.value.trim())
        const unit = event.target.unit.value.trim()
        const annotation = event.target.annotation.value.trim()
        // const main = event.target.main.value.trim()
        const main = JSON.parse(event.target.main.value.trim())

        // Verificar que todos los campos necesarios estén llenos
        if (!name) return // Evita enviar nombres vacíos
        if (!quantity) return
        if (!unit) return

        // Llamada a la lógica para enviar los datos al backend
        logic.addIngredientToRecipe(recipe._id, name, quantity, unit, annotation, main)
            .then(() => {
                // Si la adición es exitosa, actualizar el estado de la receta
                const newIngredient = { name, quantity, unit, annotation, main };  // Crear el objeto de ingrediente
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    ingredients: [...(prevRecipe.ingredients ?? []), newIngredient],  // Asegurar que ingredients sea un array
                }));

                // Limpiar los campos del formulario
                event.target.reset()
            })
            .catch(error => {
                alert(error.message) // Mostrar el error si algo sale mal
                console.error(error)
            });
    };

    if (!recipe) return <p>Cargando...</p>

    console.log('CreateRecipe -> render')

    return <section className="pt-23">
        <Header />

        <h1>Crea tu nueva receta</h1>

        <h2 className="text-blue-500">Editando: <br></br>
            author: {recipe.author} <br></br>
            id: {recipe._id} <br></br>
            title: {recipe.title} <br></br>
            images: [{recipe.images}] <br></br>
            date: {recipe.date} <br></br>
            description: {recipe.description} <br></br>
            time: {recipe.time} <br></br>
            difficulty: {recipe.difficulty} <br></br>
            tags: [{recipe.tags}] <br></br>
            {/* ingredients: [{recipe.ingredients}] <br></br> */}
            steps: [{recipe.steps}] <br></br>
        </h2 >

        <form onSubmit={handleTagsFormSubmit}>
            <input
                className="border-2"
                type="text"
                name="tag"
                placeholder="Añadir etiqueta"
            />
            <button type="submit">Agregar</button>

            <ul>
                {(recipe.tags ?? []).map((tag, index) => (
                    <li key={index}>#{tag}</li>
                ))}
            </ul>
        </form>

        <form onSubmit={handleImagesFormSubmit}>
            <input
                className="border-2"
                type="text"
                name="image"
                placeholder="Añadir imagen"
            />
            <button type="submit">Agregar</button>

            <ul className="flex flex-wrap">
                {(recipe.images ?? []).map((image, index) => (
                    <li key={index}>
                        <img src={image} alt={`Image ${index}`} className="h-30 w-auto" />
                    </li>
                ))}
            </ul>
        </form>

        <form onSubmit={handleIngredientsFormSubmit}>
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
                placeholder="Añadir nota"
            />
            <input
                className="border-2"
                type="boolean"
                name="main"
                placeholder="true o false"
            />
            <button type="submit">Agregar ingrediente</button>

            <ul className="flex flex-wrap">
                {(recipe.images ?? []).map((image, index) => (
                    <li key={index}>
                        <img src={image} alt={`Image ${index}`} className="h-30 w-auto" />
                    </li>
                ))}
            </ul>
        </form>


    </section >
}

export default CreateRecipe