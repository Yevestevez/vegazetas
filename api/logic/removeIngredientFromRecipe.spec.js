import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import removeIngredientFromRecipe from './removeIngredientFromRecipe.js'

describe('removeIngredientFromRecipe', () => {
    before(() => mongoose.connect(process.env.TEST_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds on existing user, recipe and ingredient', () => {
        let ingredient0
        let ingredient1

        return User.create({ name: 'Draco Malfoy', email: 'draco@malfoy.com', username: 'dracomalfoy', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin'],
                    ingredients: [
                        { name: 'Harina', quantity: '300', unit: 'g', annotation: 'integral', main: true },
                        { name: 'Cacao', quantity: '200', unit: 'g', annotation: 'puro', main: false }
                    ]
                })
                    .then(recipe => {
                        ingredient0 = recipe.ingredients[0]
                        ingredient1 = recipe.ingredients[1]

                        expect(recipe.ingredients).to.be.an('array').with.lengthOf(2)

                        expect(recipe.ingredients[0].name).to.equal('Harina')
                        expect(recipe.ingredients[0].quantity).to.equal(300)
                        expect(recipe.ingredients[0].unit).to.equal('g')
                        expect(recipe.ingredients[0].annotation).to.equal('integral')
                        expect(recipe.ingredients[0].main).to.equal(true)

                        expect(recipe.ingredients[1].name).to.equal('Cacao')
                        expect(recipe.ingredients[1].quantity).to.equal(200)
                        expect(recipe.ingredients[1].unit).to.equal('g')
                        expect(recipe.ingredients[1].annotation).to.equal('puro')
                        expect(recipe.ingredients[1].main).to.equal(false)

                        return removeIngredientFromRecipe(user._id.toString(), recipe._id.toString(), ingredient0._id.toString())
                    })
                    .then((result) => {
                        expect(result).to.be.undefined

                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.ingredients).to.be.an('array').with.lengthOf(1)

                        expect(recipe.ingredients[0].name).to.equal('Cacao')
                        expect(recipe.ingredients[0].quantity).to.equal(200)
                        expect(recipe.ingredients[0].unit).to.equal('g')
                        expect(recipe.ingredients[0].annotation).to.equal('puro')
                        expect(recipe.ingredients[0].main).to.equal(false)

                        expect(recipe.ingredients[1]).not.to.exist
                    })
            })
    })

    it('fails on wrong user', () => {
        let catchedError
        let ingredient

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin'],
                    ingredients: [{ name: 'Harina', quantity: '300', unit: 'g', annotation: 'integral', main: true }]
                })
                    .then(recipe => {
                        ingredient = recipe.ingredients[0]
                        expect(recipe.ingredients).to.be.an('array').with.lengthOf(1)

                        return removeIngredientFromRecipe(new ObjectId().toString(), recipe._id.toString(), ingredient._id.toString())
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('user not found')
                    })
            })
    })

    it('fails on wrong recipe', () => {
        let catchedError
        let ingredient

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin'],
                    ingredients: [{ name: 'Harina', quantity: '300', unit: 'g', annotation: 'integral', main: true }]
                })
                    .then(recipe => {
                        ingredient = recipe.ingredients[0]
                        expect(recipe.ingredients).to.be.an('array').with.lengthOf(1)

                        return removeIngredientFromRecipe(user._id.toString(), new ObjectId().toString(), ingredient._id.toString())
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('recipe not found')
                    })
            })
    })

    it('fails on wrong ingredient', () => {
        let catchedError
        let ingredient

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin'],
                    ingredients: [{ name: 'Harina', quantity: '300', unit: 'g', annotation: 'integral', main: true }]
                })
                    .then(recipe => {
                        ingredient = recipe.ingredients[0]
                        expect(recipe.ingredients).to.be.an('array').with.lengthOf(1)

                        return removeIngredientFromRecipe(user._id.toString(), recipe._id.toString(), new ObjectId().toString())
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('ingredient not found')
                    })
            })
    })

    it('fails on wrong recipe author', () => {
        let catchedError
        let ingredient

        const draco = new User({ name: 'Draco Malfoy', email: 'draco@malfoy.com', username: 'dracomalfoy', password: '123123123' })
        const ron = new User({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })

        const tarta = new Recipe({
            author: draco._id,
            title: 'Tarta de chocolate',
            images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
            description: 'La mejor tarta de chocolate de Slytherin',
            time: 120,
            difficulty: 'difficult',
            tags: ['tarta', 'postre', 'slytherin'],
            ingredients: [{ name: 'Harina', quantity: '300', unit: 'g', annotation: 'integral', main: true }]
        })

        const calabaza = new Recipe({
            author: ron._id,
            title: 'Calabaza gigante',
            images: ['https://imgs.search.brave.com/gQZAj-PRUF0b09_PAL6XY4S0qyyVJsunXmHwxByovEg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFrRGJSRHlJaEwu/anBn'],
            description: 'La calabaza más enorme de Hobbiton',
            time: 50,
            difficulty: 'easy',
            tags: ['calabaza', 'gigante', 'hobbiton', 'huerto'],
            ingredients: [{ name: 'Calabaza', quantity: '3000', unit: 'g', annotation: 'gigante', main: true }]
        })

        return Promise.all([
            draco.save(),
            ron.save(),
            tarta.save(),
            calabaza.save()
        ])
            .then(([draco, ron, tarta, calabaza]) => {
                ingredient = calabaza.ingredients[0]

                return removeIngredientFromRecipe(draco._id.toString(), calabaza._id.toString(), ingredient._id.toString())
            })
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).to.be.instanceOf(OwnershipError)
                expect(catchedError.message).to.equal('user is not author of recipe')
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    after(() => mongoose.disconnect())
})