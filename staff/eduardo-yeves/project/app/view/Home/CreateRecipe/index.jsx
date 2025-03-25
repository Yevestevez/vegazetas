import Header from '../common/Header'

import { useState } from "react"

// import { useAppContext } from '../../context'

function CreateRecipe({ recipeDraft }) {
    // const { alert } = useAppContext()

    const [recipe, setRecipe] = useState({
        title: "",
        images: [],
        description: "",
        time: "",
        difficulty: "",
        tags: [],
        ingredients: [],
        steps: []
    })

    const handleRecipeChange = (event) => {
        setRecipe({ ...recipe, [event.target.name]: event.target.value })
    }
    console.log('recipeDraft:', recipeDraft)
    console.log('recipe:', recipe)
    console.log('CreateRecipe -> render')

    const [newIngredient, setNewIngredient] = useState({
        name: "",
        quantity: "",
        unit: "",
        annotation: "",
        main: true
    })

    const handleIngredientChange = (event) => {
        setNewIngredient({ ...newIngredient, [event.target.name]: event.target.value })
    }

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, newIngredient] })
        setNewIngredient({ name: "", quantity: "", unit: "", annotation: "", main: true })
    }

    const [newStep, setNewStep] = useState({ text: "", note: "", image: "" })

    const handleStepChange = (event) => {
        setNewStep({ ...newStep, [event.target.name]: event.target.value })
    }

    const addStep = () => {
        setRecipe({ ...recipe, steps: [...recipe.steps, newStep] })
        setNewStep({ text: "", note: "", image: "" })
    }

    // ¿handleSubmit debería llamar a las lógicas createRecipe y después addIngredient y addStep?
    const handleSubmit = (event) => {
        event.preventDefault()

        try {
            logic.CreateRecipe(

            )
        } catch (error) {

        }
    }

    return <section className="pt-23">
        <Header />

        <h1>Crea tu nueva receta</h1>

        <form onSubmit={(event) => event.preventDefault()}>
            <input className="border-2" type="text" name="title" placeholder="Título" value={recipe.title} onChange={handleRecipeChange} />
            <input className="border-2" type="text" name="description" placeholder="Descripción" value={recipe.description} onChange={handleRecipeChange} />
            <input className="border-2" type="number" name="time" placeholder="Tiempo en minutos" value={recipe.time} onChange={handleRecipeChange} />
            <input className="border-2" type="text" name="difficulty" placeholder="Dificultad (easy, medium, difficult)" value={recipe.difficulty} onChange={handleRecipeChange} />

            <div>
                <h3>Ingredientes</h3>
                <input className="border-2" type="text" name="name" placeholder="Nombre" value={newIngredient.name} onChange={handleIngredientChange} />
                <input className="border-2" type="number" name="quantity" placeholder="Cantidad" value={newIngredient.quantity} onChange={handleIngredientChange} />
                <input className="border-2" type="text" name="unit" placeholder="Unidad (g, ml, etc.)" value={newIngredient.unit} onChange={handleIngredientChange} />
                <input className="border-2" type="text" name="annotation" placeholder="Notas" value={newIngredient.annotation} onChange={handleIngredientChange} />
                <button type="button" onClick={addIngredient}>Agregar Ingrediente</button>

                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.quantity} {ingredient.unit} de {ingredient.name} - {ingredient.annotation}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Pasos</h3>
                <textarea className="border-2" name="text" placeholder="Paso" value={newStep.text} onChange={handleStepChange}></textarea>
                <input className="border-2" type="text" name="note" placeholder="Nota opcional" value={newStep.note} onChange={handleStepChange} />
                <input className="border-2" type="text" name="image" placeholder="URL de imagen" value={newStep.image} onChange={handleStepChange} />
                <button type="button" onClick={addStep}>Agregar Paso</button>

                <ol>
                    {recipe.steps.map((step, index) => (
                        <li key={index}>{step.text} {step.note && `(${step.note})`}</li>
                    ))}
                </ol>
            </div>

            <button type="submit" onClick={handleSubmit}>Guardar Receta</button>
        </form>
    </section >
}

export default CreateRecipe