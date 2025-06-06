import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, ValidationError } = errors

const addTagToRecipe = (userId, recipeId, tag) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.tag(tag)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    if (recipe.tags.length >= 15)
                        throw new ValidationError('too many tags, max 15 allowed')

                    recipe.tags.push(tag)

                    return recipe.save()
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(recipe => { })
}

export default addTagToRecipe