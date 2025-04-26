import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import getRecipeById from './getRecipeById.js'

describe('getRecipeById', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds on existing user and recipe', () => {
        let createdRecipe

        return User.create({ name: 'Frodo Baggins', email: 'frodo@baggins.com', username: 'frodobaggins', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Calabaza hobbit gigante',
                    description: 'La calabaza más grande de toda La Comarca',
                    time: 150,
                    difficulty: 'easy',
                    tags: ['calabaza', 'shire', 'comarca', 'hobbit']
                })
                    .then(result => {
                        createdRecipe = result

                        return getRecipeById(user._id.toString(), createdRecipe._id.toString())
                    })
                    .then(recipe => {
                        expect(recipe.author).to.equal(user._id.toString())
                        expect(recipe.title).to.equal('Calabaza hobbit gigante')
                        expect(recipe.description).to.equal('La calabaza más grande de toda La Comarca')
                        expect(recipe.time).to.equal(150)
                        expect(recipe.difficulty).to.equal('easy')
                        expect(recipe.tags).to.deep.equal(['calabaza', 'shire', 'comarca', 'hobbit'])
                    })
            })
    })

    it('fails on wrong user', () => {
        let catchedError

        return User.create({ name: 'Frodo Baggins', email: 'frodo@baggins.com', username: 'frodobaggins', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Calabaza hobbit gigante',
                    description: 'La calabaza más grande de toda La Comarca',
                    time: 150,
                    difficulty: 'easy',
                    tags: ['calabaza', 'shire', 'comarca', 'hobbit']
                })
                    .then(recipe => {
                        return getRecipeById(new ObjectId().toString(), recipe._id.toString())
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

        return User.create({ name: 'Frodo Baggins', email: 'frodo@baggins.com', username: 'frodobaggins', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Calabaza hobbit gigante',
                    description: 'La calabaza más grande de toda La Comarca',
                    time: 150,
                    difficulty: 'easy',
                    tags: ['calabaza', 'shire', 'comarca', 'hobbit']
                })
                    .then(recipe => {
                        return getRecipeById(user._id.toString(), new ObjectId().toString())
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('recipe not found')
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
                        return getRecipeById(frodo._id.toString(), recipe._id.toString())
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