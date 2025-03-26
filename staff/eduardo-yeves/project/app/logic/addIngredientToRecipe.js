import { validate, errors } from 'com'

const addIngredientToRecipe = (
    recipeId,
    name,
    quantity,
    unit,
    annotation,
    main
) => {
    validate.id(recipeId, 'recipeId')
    validate.name(name)
    validate.quantity(quantity)
    validate.unit(unit)
    if (annotation) validate.annotation(annotation)
    if (main !== undefined) validate.main(main)

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/ingredients`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            quantity,
            unit,
            annotation,
            main
        })
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 201) return;

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error];

                    throw new constructor(message)
                })
        })
}

export default addIngredientToRecipe