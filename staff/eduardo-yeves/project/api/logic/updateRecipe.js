import { Recipe, User } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const updateRecipe = (
    userId,
    recipeId,
    title,
    images,
    description,
    time,
    difficulty,
    tags
) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.title(title)
    validate.images(images)
    validate.description(description)
    validate.time(time)
    validate.difficulty(difficulty)
    validate.tags(tags)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    recipe.title = title
                    recipe.images = images
                    recipe.description = description
                    recipe.time = time
                    recipe.difficulty = difficulty
                    recipe.tags = tags

                    return recipe.save()
                        .catch(error => { throw new SystemError(error.message) })
                })

        })
        .then(recipe => { })
}

export default updateRecipe