import { Recipe, User } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const createRecipe = (
    userId,
    title,
    images,
    description,
    time,
    difficulty,
    tags
) => {
    validate.id(userId, 'userId')
    validate.title(title)
    if (description) validate.description(description)
    if (time) validate.time(time)
    if (difficulty) validate.difficulty(difficulty)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            const recipe = new Recipe({
                author: user._id,
                title,
                images,
                description,
                time,
                difficulty,
                tags
            })

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => {
            const recipeId = recipe._id.toString()

            return recipeId
        })
}

export default createRecipe