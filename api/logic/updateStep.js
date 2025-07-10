import { Recipe, User } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError, ValidationError } = errors

const updateStep = (
    userId,
    recipeId,
    stepId,
    text,
    note,
    image
) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')
    validate.id(stepId, 'stepId')
    validate.text(text)

    const URL_REGEX = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
    if (image !== undefined) {
        if (typeof image !== 'string') throw new ValidationError('invalid image type, must be a string')
        if (image !== '' && !URL_REGEX.test(image)) throw new ValidationError('invalid image syntax, must be a valid URL')
    }

    if (note !== undefined) {
        if (typeof note !== 'string') throw new ValidationError('invalid note type, must be a string')
        if (note.length > 500) throw new ValidationError('invalid note length, must be 500 characters maximum')
    }

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
                .then(recipe => {
                    if (!recipe) throw new NotFoundError('recipe not found')

                    if (recipe.author.toString() !== userId) throw new OwnershipError('user is not author of recipe')

                    const { steps } = recipe
                    const stepToUpdate = steps.find(step => step._id.toString() === stepId)

                    if (!stepToUpdate) throw new NotFoundError('step not found')

                    stepToUpdate.text = text
                    stepToUpdate.note = note
                    stepToUpdate.image = image

                    return recipe.save()
                        .catch(error => { throw new SystemError(error.message) })
                })

        })
        .then(() => {})
}

export default updateStep