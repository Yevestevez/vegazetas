import { Recipe, User } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const updateRecipe = (
    userId,
    recipeId,
    title,
    description,
    time,
    difficulty
) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.title(title)
    if (description) validate.description(description)
    if (time) validate.time(time)
    if (difficulty) validate.difficulty(difficulty)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    if (recipe.author.toString() !== userId) throw new OwnershipError('user is not author of recipe')

                    recipe.title = title
                    recipe.description = description
                    recipe.time = time
                    recipe.difficulty = difficulty

                    return recipe.save()
                        .catch(error => { throw new SystemError(error.message) })
                })

        })
        .then(recipe => { })
}

export default updateRecipe