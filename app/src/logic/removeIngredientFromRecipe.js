import { validate, errors } from 'com'

const removeIngredientFromRecipe = (recipeId, ingredientId) => {
    validate.id(recipeId, 'recipeId')
    validate.id(ingredientId, 'ingredientId')

    return fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}/ingredients/${ingredientId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 204) return

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default removeIngredientFromRecipe