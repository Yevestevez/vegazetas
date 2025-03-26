import { User, Recipe } from '../data/models.js'

import { validate, errors } from 'com'
const { NotFoundError, SystemError, OwnershipError } = errors

const getRecipeById = (userId, recipeId) => {
    validate.id(userId, 'userId')
    validate.id(recipeId, 'recipeId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Recipe.findById(recipeId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(recipe => {
            if (!recipe) throw new NotFoundError('recipe not found')

            if (recipe.author.toString() !== userId) throw new OwnershipError('user is not author of recipe')

            if (recipe._id) {
                recipe.id = recipe._id.toString()

                delete recipe._id
            }

            if (recipe.author._id) {
                recipe.author.id = recipe.author._id.toString()

                delete recipe.author._id
            }

            delete recipe.__v

            recipe.own = userId === recipe.author.id

            return recipe
        })
}

// const getRecipeById = (userId, recipeId) => {
//     validate.id(userId, 'userId')
//     validate.id(recipeId, 'recipeId')

//     return User.findById(userId)
//         .catch(error => { throw new SystemError(error.message) })
//         .then(user => {
//             if (!user) throw new NotFoundError('User not found')

//             return Recipe.findById(recipeId)
//                 .lean()  // Convierte el documento a un objeto plano
//                 .catch(error => { throw new SystemError(error.message) })
//         })
//         .then(recipe => {
//             if (!recipe) throw new NotFoundError('Recipe not found')

//             if (recipe.author.toString() !== userId) throw new OwnershipError('User is not the author of this recipe')

//             // Aquí solo estamos formateando los ids de la receta y el autor
//             recipe.id = recipe._id.toString()
//             delete recipe._id
//             delete recipe.__v

//             recipe.author.id = recipe.author._id.toString()  // Solo necesitamos el _id del autor
//             delete recipe.author._id  // Elimina el _id original

//             recipe.own = userId === recipe.author.id

//             return recipe
//         })
// }

export default getRecipeById