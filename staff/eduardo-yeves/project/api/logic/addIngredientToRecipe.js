import { Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const addIngredientToRecipe = (recipeId, name, quantity, unit, annotation, main) => {
    validate.id(recipeId, 'recipeId')
    validate.name(name)
    validate.quantity(quantity)
    validate.unit(unit)
    validate.annotation(annotation)
    validate.main(main)

    const ingredient = { name, quantity, unit, annotation, main }

    return Recipe.findById(recipeId)
        .catch(error => { throw new SystemError(error.message) })
        .then(recipe => {
            if (!recipe) throw new NotFoundError('recipe not found')

            recipe.ingredients.push(ingredient)

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => { })
}

export default addIngredientToRecipe