import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const addStepToRecipe = (userId, recipeId, text, note, image) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.text(text)
    if (note) validate.note(note)
    if (image) validate.image(image)

    const step = { text, note, image }

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    recipe.steps.push(step)

                    return recipe.save()
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(recipe => {
            return recipe.steps[recipe.steps.length - 1]._id.toString()
        })
}

export default addStepToRecipe