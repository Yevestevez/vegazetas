import 'dotenv/config'
import mongoose from 'mongoose'
import { expect } from 'chai'

import { User, Recipe } from '../data/models.js'
import getRecipeById from './getRecipeById.js'

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

const { Types: { ObjectId } } = mongoose

describe('getRecipeById', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([
        User.deleteMany(),
        Recipe.deleteMany()
    ]))

    it('succeeds on own recipe', () => {
        let userId
        let recipeId

        return User.create({
            name: 'Test User',
            email: 'test@test.com',
            username: 'testuser',
            password: '123123123'
        })
            .then(user => {
                userId = user._id.toString()

                return Recipe.create({
                    author: user._id,
                    title: 'My Recipe',
                    images: [],
                    description: 'desc',
                    ingredients: [],
                    steps: [],
                    published: false
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                return getRecipeById(userId, recipeId)
            })
            .then(recipe => {
                expect(recipe.id).to.equal(recipeId)
                expect(recipe.author).to.equal(userId)
                expect(recipe.own).to.equal(true)
            })
    })

    it('fails on non-existing user', () => {
        const fakeUserId = new ObjectId().toString()
        let catchedError

        return User.create({
            name: 'User',
            email: 'u@u.com',
            username: 'user123',
            password: '123123123'
        })
            .then(() => {
                // Recipe exists but userId is wrong
                return Recipe.create({
                    author: new ObjectId(),
                    title: 'Test Recipe X',
                    images: [],
                    description: 'desc',
                    ingredients: [],
                    steps: [],
                    published: true
                })
            })
            .then(recipe => {
                return getRecipeById(fakeUserId, recipe._id.toString())
                    .catch(error => catchedError = error)
            })
            .finally(() => {
                expect(catchedError).to.be.instanceOf(NotFoundError)
                expect(catchedError.message).to.equal('user not found')
            })
    })

    it('fails on non-existing recipe', () => {
        let userId
        const fakeRecipeId = new ObjectId().toString()
        let catchedError

        return User.create({
            name: 'User',
            email: 'u@u.com',
            username: 'user123',
            password: '123123123'
        })
            .then(user => {
                userId = user._id.toString()
                return getRecipeById(userId, fakeRecipeId)
                    .catch(error => catchedError = error)
            })
            .finally(() => {
                expect(catchedError).to.be.instanceOf(NotFoundError)
                expect(catchedError.message).to.equal('recipe not found')
            })
    })

    it('succeeds on accessing another user’s published recipe', () => {
        let userA, userB, recipeId

        return User.create({
            name: 'Ana',
            email: 'ana@a.com',
            username: 'anauser',
            password: '123123123'
        })
            .then(user => {
                userA = user

                return User.create({
                    name: 'Bob',
                    email: 'bob@b.com',
                    username: 'bobuser',
                    password: '123123123'
                })
            })
            .then(user => {
                userB = user

                return Recipe.create({
                    author: userA._id,
                    title: 'Published Recipe',
                    images: [],
                    description: 'desc',
                    ingredients: [],
                    steps: [],
                    published: true
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                return getRecipeById(userB._id.toString(), recipeId)
            })
            .then(recipe => {
                expect(recipe.own).to.equal(false)
                expect(recipe.id).to.equal(recipeId)
            })
    })

    it('fails when accessing an unpublished recipe from another user', () => {
        let authorId, otherUserId, recipeId
        let catchedError

        return User.create({
            name: 'Author',
            email: 'author@a.com',
            username: 'authoruser',
            password: '123123123'
        })
            .then(user => {
                authorId = user._id.toString()

                return User.create({
                    name: 'Viewer',
                    email: 'viewer@v.com',
                    username: 'vieweruser',
                    password: '123123123'
                })
            })
            .then(user => {
                otherUserId = user._id.toString()

                return Recipe.create({
                    author: authorId,
                    title: 'Private Recipe',
                    images: [],
                    description: 'desc',
                    ingredients: [],
                    steps: [],
                    published: false
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()

                return getRecipeById(otherUserId, recipeId)
                    .catch(error => catchedError = error)
            })
            .finally(() => {
                expect(catchedError).to.be.instanceOf(OwnershipError)
                expect(catchedError.message).to.equal('recipe not published')
            })
    })

    afterEach(() => Promise.all([
        User.deleteMany(),
        Recipe.deleteMany()
    ]))

    after(() => mongoose.disconnect())
})