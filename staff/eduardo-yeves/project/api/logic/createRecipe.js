import { Recipe, User, Step } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const createRecipe = (
    userId,
    title,
    images,
    description,
    time,
    difficulty,
    tags,
    ingredients,
    steps
) => {
    validate.id(userId, 'userId')
    validate.title(title)
    validate.images(images)
    validate.description(description)
    validate.time(time)
    validate.difficulty(difficulty)
    validate.tags(tags)
    validate.ingredients(ingredients)
    validate.steps(steps)

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
                tags,
                ingredients,
                steps
            })

            return recipe.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => { })
}

export default createRecipe