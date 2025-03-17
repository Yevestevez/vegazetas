import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import removeStepFromRecipe from './removeStepFromRecipe.js'

describe('removeStepFromRecipe', () => {
    before(() => mongoose.connect(process.env.TEST_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds on existing user, recipe and step', () => {
        let step

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
                    steps: [{ text: 'Mezclamos la harina con el cacao en polvo', note: 'que quede todo bien mezclado y sin grumos', image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg' }]
                })
                    .then(recipe => {
                        step = recipe.steps[0]
                        expect(recipe.steps).to.be.an('array').with.lengthOf(1)

                        return removeStepFromRecipe(user._id.toString(), recipe._id.toString(), step._id.toString())
                    })
                    .then(() => {
                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.steps).to.be.an('array').with.lengthOf(0)
                    })
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