import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import updateRecipe from './updateRecipe.js'

describe('updateRecipe', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds on existing user and recipe', () => {
        return User.create({ name: 'Draco Malfoy', email: 'draco@malfoy.com', username: 'dracomalfoy', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin']
                })
                    .then(recipe => {
                        expect(recipe.author.toString()).to.equal(user._id.toString())
                        expect(recipe.title).to.equal('Tarta de chocolate')
                        expect(recipe.images).to.deep.equal(['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'])
                        expect(recipe.description).to.equal('La mejor tarta de chocolate de Slytherin')
                        expect(recipe.time).to.equal(120)
                        expect(recipe.difficulty).to.equal('difficult')
                        expect(recipe.tags).to.deep.equal(['tarta', 'postre', 'slytherin'])

                        return updateRecipe(
                            user._id.toString(), //userId
                            recipe._id.toString(), // recipeId
                            'Tarta de manzana', // title
                            'Una tarta de manzana', // description
                            90, // time
                            'easy', // difficulty
                        )
                            .then(result => {
                                expect(result).to.be.undefined

                                return Recipe.findOne()
                            })
                            .then(recipe => {
                                expect(recipe.author.toString()).to.equal(user._id.toString())
                                expect(recipe.title).to.equal('Tarta de manzana')
                                expect(recipe.images).to.deep.equal(['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'])
                                expect(recipe.description).to.equal('Una tarta de manzana')
                                expect(recipe.time).to.equal(90)
                                expect(recipe.difficulty).to.equal('easy')
                                expect(recipe.tags).to.deep.equal(['tarta', 'postre', 'slytherin'])
                            })
                    })
            })
    })

    it('fails on wrong user', () => {
        let catchedError

        return User.create({ name: 'Draco Malfoy', email: 'draco@malfoy.com', username: 'dracomalfoy', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin']
                })
                    .then(recipe => {
                        expect(recipe.author.toString()).to.equal(user._id.toString())
                        expect(recipe.title).to.equal('Tarta de chocolate')
                        expect(recipe.images).to.deep.equal(['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'])
                        expect(recipe.description).to.equal('La mejor tarta de chocolate de Slytherin')
                        expect(recipe.time).to.equal(120)
                        expect(recipe.difficulty).to.equal('difficult')
                        expect(recipe.tags).to.deep.equal(['tarta', 'postre', 'slytherin'])

                        return updateRecipe(
                            new ObjectId().toString(),
                            recipe._id.toString(), // recipeId
                            'Tarta de manzana', // title
                            'Una tarta de manzana', // description
                            90, // time
                            'easy', // difficulty
                        )
                            .catch(error => catchedError = error)
                            .finally(() => {
                                expect(catchedError).to.be.instanceOf(NotFoundError)
                                expect(catchedError.message).to.equal('user not found')
                            })
                    })
            })
    })

    it('fails on wrong recipe', () => {
        let catchedError

        return User.create({ name: 'Draco Malfoy', email: 'draco@malfoy.com', username: 'dracomalfoy', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin']
                })
                    .then(recipe => {
                        expect(recipe.author.toString()).to.equal(user._id.toString())
                        expect(recipe.title).to.equal('Tarta de chocolate')
                        expect(recipe.images).to.deep.equal(['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'])
                        expect(recipe.description).to.equal('La mejor tarta de chocolate de Slytherin')
                        expect(recipe.time).to.equal(120)
                        expect(recipe.difficulty).to.equal('difficult')
                        expect(recipe.tags).to.deep.equal(['tarta', 'postre', 'slytherin'])

                        return updateRecipe(
                            user._id.toString(), //userId
                            new ObjectId().toString(),
                            'Tarta de manzana', // title
                            'Una tarta de manzana', // description
                            90, // time
                            'easy', // difficulty
                        )
                            .catch(error => catchedError = error)
                            .finally(() => {
                                expect(catchedError).to.be.instanceOf(NotFoundError)
                                expect(catchedError.message).to.equal('recipe not found')
                            })
                    })
            })
    })

    it('fails on wrong recipe author', () => {
        let catchedError
        let frodo
        let sam

        return User.create({ name: 'Frodo Baggins', email: 'frodo@baggins.com', username: 'frodobaggins', password: '123123123' })
            .then(user => {
                frodo = user

                return User.create({ name: 'Sam Gamgee', email: 'sam@Gamgee.com', username: 'samgamgee', password: '123123123' })
            })
            .then(user2 => {
                sam = user2
                return Recipe.create({
                    author: sam.id,
                    title: 'Calabaza hobbit gigante',
                    description: 'La calabaza más grande de toda La Comarca',
                    time: 150,
                    difficulty: 'easy',
                    tags: ['calabaza', 'shire', 'comarca', 'hobbit']
                })
                    .then(recipe => {
                        return updateRecipe(
                            frodo._id.toString(),
                            recipe._id.toString(), // recipeId
                            'Tarta de manzana', // title
                            'Una tarta de manzana', // description
                            90, // time
                            'easy', // difficulty
                        )
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(OwnershipError)
                        expect(catchedError.message).to.equal('user is not author of recipe')
                    })
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    after(() => mongoose.disconnect())
})