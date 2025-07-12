import 'dotenv/config'

import { expect } from 'chai'
import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError, ValidationError } = errors

import updateStep from './updateStep.js'

describe('updateStep', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('updates step fields correctly', () => {
        let userId, recipeId, stepId

        return User.create({ name: 'Neville', email: 'neville@hogwarts.com', username: 'neville', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Cuidado de plantas mágicas',
                    steps: [
                        { text: 'Regar la mandrágora', note: 'con guantes', image: 'http://mandragora.com/img.jpg' }
                    ]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                stepId = recipe.steps[0]._id.toString()

                return updateStep(userId, recipeId, stepId, 'Regar mandrágora joven', 'usar agua templada', 'http://nueva.com/img.jpg')
            })
            .then(() => Recipe.findById(recipeId))
            .then(recipe => {
                const step = recipe.steps.id(stepId)
                expect(step.text).to.equal('Regar mandrágora joven')
                expect(step.note).to.equal('usar agua templada')
                expect(step.image).to.equal('http://nueva.com/img.jpg')
            })
    })

    it('allows clearing note and image fields', () => {
        let userId, recipeId, stepId

        return User.create({ name: 'Neville', email: 'neville@hogwarts.com', username: 'neville', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Cuidado de plantas mágicas',
                    steps: [
                        { text: 'Regar la mandrágora', note: 'con guantes', image: 'http://mandragora.com/img.jpg' }
                    ]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                stepId = recipe.steps[0]._id.toString()

                return updateStep(userId, recipeId, stepId, 'Texto limpio', '', '')
            })
            .then(() => Recipe.findById(recipeId))
            .then(recipe => {
                const step = recipe.steps.id(stepId)
                expect(step.text).to.equal('Texto limpio')
                expect(step.note).to.equal('')
                expect(step.image).to.equal('')
            })
    })

    it('fails if user does not exist', () => {
        const fakeUserId = new ObjectId().toString()
        let recipeId, stepId

        return User.create({ name: 'Luna', email: 'luna@hogwarts.com', username: 'luna', password: 'a123123123' })
            .then(user => {
                return Recipe.create({
                    author: user._id,
                    title: 'Poción calmante',
                    steps: [{ text: 'Mezclar ingredientes', note: '', image: '' }]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                stepId = recipe.steps[0]._id.toString()
                return updateStep(fakeUserId, recipeId, stepId, 'Nuevo texto', '', '')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('user not found')
            })
    })

    it('fails if step does not exist', () => {
        let userId, recipeId
        const fakeStepId = new ObjectId().toString()

        return User.create({ name: 'Seamus', email: 'seamus@hogwarts.com', username: 'seamus', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Explosión controlada',
                    steps: [{ text: 'Encender mecha', note: '', image: '' }]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                return updateStep(userId, recipeId, fakeStepId, 'Nuevo texto', '', '')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('step not found')
            })
    })

    it('fails if user is not the author', () => {
        let user1Id, user2Id, recipeId, stepId

        return Promise.all([
            User.create({ name: 'Harry', email: 'harry@hogwarts.com', username: 'harry', password: 'a123123123' }),
            User.create({ name: 'Draco', email: 'draco@hogwarts.com', username: 'draco', password: 'a123123123' })
        ])
            .then(([user1, user2]) => {
                user1Id = user1._id.toString()
                user2Id = user2._id.toString()

                return Recipe.create({
                    author: user1Id,
                    title: 'Hechizo escudo',
                    steps: [{ text: 'Pronunciar protego', note: '', image: '' }]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                stepId = recipe.steps[0]._id.toString()

                return updateStep(user2Id, recipeId, stepId, 'Texto nuevo', '', '')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(OwnershipError)
                expect(error.message).to.equal('user is not author of recipe')
            })
    })

    it('fails if image is not a valid URL', () => {
        let userId, recipeId, stepId

        return User.create({ name: 'Fred', email: 'fred@hogwarts.com', username: 'fred', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Travesura mágica',
                    steps: [{ text: 'Tirar petardo', note: '', image: '' }]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                stepId = recipe.steps[0]._id.toString()

                return updateStep(userId, recipeId, stepId, 'Texto', '', 'no-es-url')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(ValidationError)
                expect(error.message).to.equal('invalid image syntax, must be a valid URL')
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))
    after(() => mongoose.disconnect())
})