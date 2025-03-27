import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const addIngredientToRecipe = (userId, recipeId, name, quantity, unit, annotation, main) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.name(name)
    validate.quantity(quantity)
    validate.unit(unit)
    if (annotation) validate.annotation(annotation)
    if (main !== undefined) validate.main(main)

    const ingredient = { name, quantity, unit, annotation, main }

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    recipe.ingredients.push(ingredient)

                    return recipe.save()
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(recipe => {
            return recipe.ingredients[recipe.ingredients.length - 1]._id.toString()
        })
}

export default addIngredientToRecipe