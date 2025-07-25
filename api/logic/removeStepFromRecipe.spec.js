import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import removeStepFromRecipe from './removeStepFromRecipe.js'

describe('removeStepFromRecipe', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds on existing user, recipe and step', () => {
        let step0
        let step1

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
                    steps: [
                        { text: 'Mezclamos la harina con el cacao en polvo', note: 'que quede todo bien mezclado y sin grumos', image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg' },
                        { text: 'Añadimos el azúcar', note: 'cuidado con no pasarse', image: 'https://th.bing.com/th/id/OIP.mBDNIyr9bjqBw5aYxlmTswHaE8?rs=1&pid=ImgDetMain' }
                    ]
                })
                    .then(recipe => {
                        step0 = recipe.steps[0]
                        step1 = recipe.steps[1]

                        expect(recipe.steps).to.be.an('array').with.lengthOf(2)

                        expect(recipe.steps[0].text).to.equal('Mezclamos la harina con el cacao en polvo')
                        expect(recipe.steps[0].note).to.equal('que quede todo bien mezclado y sin grumos')
                        expect(recipe.steps[0].image).to.equal('https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg')

                        expect(recipe.steps[1].text).to.equal('Añadimos el azúcar')
                        expect(recipe.steps[1].note).to.equal('cuidado con no pasarse')
                        expect(recipe.steps[1].image).to.equal('https://th.bing.com/th/id/OIP.mBDNIyr9bjqBw5aYxlmTswHaE8?rs=1&pid=ImgDetMain')

                        return removeStepFromRecipe(user._id.toString(), recipe._id.toString(), step0._id.toString())
                    })
                    .then(result => {
                        expect(result).to.be.undefined

                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.steps).to.be.an('array').with.lengthOf(1)

                        expect(recipe.steps[0].text).to.equal('Añadimos el azúcar')
                        expect(recipe.steps[0].note).to.equal('cuidado con no pasarse')
                        expect(recipe.steps[0].image).to.equal('https://th.bing.com/th/id/OIP.mBDNIyr9bjqBw5aYxlmTswHaE8?rs=1&pid=ImgDetMain')

                        expect(recipe.steps[1]).not.to.exist
                    })
            })
    })

    it('reorders remaining steps after one is removed', () => {
        let step0, step1, step2
        let userId, recipeId

        return User.create({ name: 'Hermione Granger', email: 'hermione@hogwarts.com', username: 'hermione', password: '123123123' })
            .then(user => {
                userId = user._id.toString()

                return Recipe.create({
                    author: userId,
                    title: 'Poción multijugos',
                    images: [],
                    description: 'Transformación temporal en otra persona',
                    time: 90,
                    difficulty: 'difficult',
                    tags: ['poción', 'transformación'],
                    steps: [
                        { text: 'Picar ingredientes', note: '', image: '' },
                        { text: 'Añadir mandrágora', note: '', image: '' },
                        { text: 'Remover durante 30 min', note: '', image: '' }
                    ]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                step0 = recipe.steps[0]
                step1 = recipe.steps[1]
                step2 = recipe.steps[2]

                return removeStepFromRecipe(userId, recipeId, step1._id.toString())
            })
            .then(() => Recipe.findById(recipeId))
            .then(recipe => {
                expect(recipe.steps).to.have.lengthOf(2)

                // Reordenado correctamente
                expect(recipe.steps[0]._id.toString()).to.equal(step0._id.toString())
                expect(recipe.steps[0].order).to.equal(0)

                expect(recipe.steps[1]._id.toString()).to.equal(step2._id.toString())
                expect(recipe.steps[1].order).to.equal(1)
            })
    })

    it('fails on wrong user', () => {
        let catchedError
        let step

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
                    steps: [{ text: 'Mezclamos la harina con el cacao en polvo', note: 'que quede todo bien mezclado y sin grumos', image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg' }]
                })
                    .then(recipe => {
                        step = recipe.steps[0]
                        expect(recipe.steps).to.be.an('array').with.lengthOf(1)

                        return removeStepFromRecipe(new ObjectId().toString(), recipe._id.toString(), step._id.toString())
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
        let step

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
                    steps: [{ text: 'Mezclamos la harina con el cacao en polvo', note: 'que quede todo bien mezclado y sin grumos', image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg' }]
                })
                    .then(recipe => {
                        step = recipe.steps[0]
                        expect(recipe.steps).to.be.an('array').with.lengthOf(1)

                        return removeStepFromRecipe(user._id.toString(), new ObjectId().toString(), step._id.toString())
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('recipe not found')
                    })
            })
    })

    it('fails on wrong step', () => {
        let catchedError
        let step

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
                    steps: [{ text: 'Mezclamos la harina con el cacao en polvo', note: 'que quede todo bien mezclado y sin grumos', image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg' }]
                })
                    .then(recipe => {
                        step = recipe.steps[0]
                        expect(recipe.steps).to.be.an('array').with.lengthOf(1)

                        return removeStepFromRecipe(user._id.toString(), recipe._id.toString(), new ObjectId().toString())
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('step not found')
                    })
            })
    })

    it('fails on wrong recipe author', () => {
        let catchedError
        let step

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
            steps: [{ text: 'Mezclamos la harina con el cacao en polvo', note: 'que quede todo bien mezclado y sin grumos', image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg' }]
        })

        const calabaza = new Recipe({
            author: ron._id,
            title: 'Calabaza gigante',
            images: ['https://imgs.search.brave.com/gQZAj-PRUF0b09_PAL6XY4S0qyyVJsunXmHwxByovEg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFrRGJSRHlJaEwu/anBn'],
            description: 'La calabaza más enorme de Hobbiton',
            time: 50,
            difficulty: 'easy',
            tags: ['calabaza', 'gigante', 'hobbiton', 'huerto'],
            steps: [{ text: 'Mezclamos la harina con el cacao en polvo', note: 'que quede todo bien mezclado y sin grumos', image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg' }]
        })

        return Promise.all([
            draco.save(),
            ron.save(),
            tarta.save(),
            calabaza.save()
        ])
            .then(([draco, ron, tarta, calabaza]) => {
                step = calabaza.steps[0]

                return removeStepFromRecipe(draco._id.toString(), calabaza._id.toString(), step._id.toString())
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