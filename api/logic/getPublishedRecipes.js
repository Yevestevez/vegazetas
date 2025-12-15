import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError } = errors

const getPublishedRecipes = userId => {
    validate.id(userId, 'userId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            const favorites = (user.favorites || []).map(fav => fav.toString())

            return Recipe.find({
                author: { $ne: user._id },
                published: true
            })
                .select('_id title images author date published')
                .select('-__v')
                .populate('author', 'username')
                .lean()
                .sort('-date')
                .catch(error => { throw new SystemError(error.message) })
                .then(recipes => {
                    recipes.forEach(recipe => {
                        recipe.id = recipe._id.toString()
                        delete recipe._id

                        if (recipe.author._id) {
                            recipe.author.id = recipe.author._id.toString()

                            delete recipe.author._id
                        }

                        recipe.own = userId === recipe.author.id

                        recipe.isFavorite = favorites.includes(recipe.id)
                    })

                    return recipes
                })
        })
}

export default getPublishedRecipes