import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import removeTagFromRecipe from './removeTagFromRecipe.js'

describe('removeTagFromRecipe', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds on existing user, recipe and tag', () => {
        const index = 0

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
                    ingredients: [{ name: 'Harina', quantity: '300', unit: 'g', annotation: 'integral', main: true }]
                })
                    .then(recipe => {
                        expect(recipe.tags).to.be.an('array').with.lengthOf(3)
                        expect(recipe.tags[0]).to.be.deep.equal('tarta')
                        expect(recipe.tags[1]).to.be.deep.equal('postre')
                        expect(recipe.tags[2]).to.be.deep.equal('slytherin')

                        return removeTagFromRecipe(user._id.toString(), recipe._id.toString(), index)
                    })
                    .then(result => {
                        expect(result).to.be.undefined
                    })
                    .then(() => {
                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.tags).to.be.an('array').with.lengthOf(2)

                        expect(recipe.tags[0]).to.be.deep.equal('postre')
                        expect(recipe.tags[1]).to.be.deep.equal('slytherin')
                    })
            })
    })

    it('fails on wrong user', () => {
        let catchedError
        const index = 0

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
                        expect(recipe.tags).to.be.an('array').with.lengthOf(3)

                        return removeTagFromRecipe(new ObjectId().toString(), recipe._id.toString(), index)
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
        const index = 0

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
                        expect(recipe.tags).to.be.an('array').with.lengthOf(3)

                        return removeTagFromRecipe(user._id.toString(), new ObjectId().toString(), index)
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('recipe not found')
                    })
            })
    })

    it('fails on not found tag', () => {
        let catchedError
        const index = 3

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
                        expect(recipe.tags).to.be.an('array').with.lengthOf(3)

                        return removeTagFromRecipe(user._id.toString(), recipe._id.toString(), index)
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('tag not found')
                    })
            })
    })

    it('fails on wrong recipe author', () => {
        let catchedError
        const index = 0

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
                return removeTagFromRecipe(draco._id.toString(), calabaza._id.toString(), index)
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