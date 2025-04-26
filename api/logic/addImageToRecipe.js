import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, ValidationError } = errors

const addImageToRecipe = (userId, recipeId, image) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.image(image)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    if (recipe.images.length >= 2)
                        throw new ValidationError('too many images, max 2 allowed')

                    recipe.images.push(image)

                    return recipe.save()
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(recipe => { })
}

export default addImageToRecipe