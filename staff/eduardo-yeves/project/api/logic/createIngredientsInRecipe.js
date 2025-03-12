import { Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const createIngredientsInRecipe = (recipeId, ingredients) => {
    validate.id(recipeId, 'recipeId')
    validate.ingredients(ingredients)

    ingredients.forEach(({ name, quantity, unit, annotation }) => {
        validate.name(name)
        validate.quantity(quantity)
        validate.unit(unit)
        validate.annotation(annotation)
    })

    return Recipe.findById(recipeId)
        .catch(error => { throw new SystemError(error.message) })
        .then(recipe => {
            if (!recipe) throw new NotFoundError('recipe not found')

            recipe.ingredients.push(...ingredients)

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(ingredients => { })
}

export default createIngredientsInRecipe