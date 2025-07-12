import 'dotenv/config'

import { expect } from 'chai'
import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import reorderStep from './reorderStep.js'

describe('reorderStep', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('moves step up correctly', () => {
        let userId, recipeId, step1Id

        return User.create({ name: 'Luna Lovegood', email: 'luna@hogwarts.com', username: 'lunalovegood', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Poción para ver thestrals',
                    steps: [
                        { text: 'Cortar raíz de asfódelo', order: 0 },
                        { text: 'Mezclar con sangre de murciélago', order: 1 },
                        { text: 'Cantar una melodía suave', order: 2 }
                    ]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                step1Id = recipe.steps[1]._id.toString()

                return reorderStep(userId, recipeId, step1Id, 'up')
            })
            .then(() => Recipe.findById(recipeId))
            .then(recipe => {
                expect(recipe.steps[0].text).to.equal('Mezclar con sangre de murciélago')
                expect(recipe.steps[1].text).to.equal('Cortar raíz de asfódelo')
                expect(recipe.steps[2].text).to.equal('Cantar una melodía suave')

                expect(recipe.steps[0].order).to.equal(0)
                expect(recipe.steps[1].order).to.equal(1)
                expect(recipe.steps[2].order).to.equal(2)
            })
    })

    it('moves step down correctly', () => {
        let userId, recipeId, step0Id

        return User.create({ name: 'Luna Lovegood', email: 'luna@hogwarts.com', username: 'lunalovegood', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Poción para ver thestrals',
                    steps: [
                        { text: 'Cortar raíz de asfódelo', order: 0 },
                        { text: 'Mezclar con sangre de murciélago', order: 1 },
                        { text: 'Cantar una melodía suave', order: 2 }
                    ]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                step0Id = recipe.steps[0]._id.toString()

                return reorderStep(userId, recipeId, step0Id, 'down')
            })
            .then(() => Recipe.findById(recipeId))
            .then(recipe => {
                expect(recipe.steps[0].text).to.equal('Mezclar con sangre de murciélago')
                expect(recipe.steps[1].text).to.equal('Cortar raíz de asfódelo')
                expect(recipe.steps[2].text).to.equal('Cantar una melodía suave')

                expect(recipe.steps[0].order).to.equal(0)
                expect(recipe.steps[1].order).to.equal(1)
                expect(recipe.steps[2].order).to.equal(2)
            })
    })

    it('does nothing if moving up the first step', () => {
        let userId, recipeId, step0Id

        return User.create({ name: 'Luna Lovegood', email: 'luna@hogwarts.com', username: 'lunalovegood', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Poción para ver thestrals',
                    steps: [
                        { text: 'Cortar raíz de asfódelo', order: 0 },
                        { text: 'Mezclar con sangre de murciélago', order: 1 },
                        { text: 'Cantar una melodía suave', order: 2 }
                    ]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                step0Id = recipe.steps[0]._id.toString()

                return reorderStep(userId, recipeId, step0Id, 'up')
            })
            .then(() => Recipe.findById(recipeId))
            .then(recipe => {
                // Nada ha cambiado
                expect(recipe.steps.map(s => s.text)).to.eql([
                    'Cortar raíz de asfódelo',
                    'Mezclar con sangre de murciélago',
                    'Cantar una melodía suave'
                ])
            })
    })

    it('fails if user is not author', () => {
        let lunaId, hermioneId, recipeId, stepId
        return Promise.all([
            User.create({ name: 'Luna', email: 'luna@hogwarts.com', username: 'luna', password: '123' }),
            User.create({ name: 'Hermione', email: 'hermione@hogwarts.com', username: 'hermione', password: '123' })
        ])
            .then(([luna, hermione]) => {
                lunaId = luna._id.toString()
                hermioneId = hermione._id.toString()
                return Recipe.create({
                    author: lunaId,
                    title: 'Poción de la verdad',
                    steps: [
                        { text: 'Extraer esencia de veritaserum', order: 0 },
                        { text: 'Diluir en agua', order: 1 }
                    ]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                stepId = recipe.steps[1]._id.toString()
                return reorderStep(hermioneId, recipeId, stepId, 'up')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(OwnershipError)
                expect(error.message).to.equal('user is not author of recipe')
            })
    })

    it('fails if user does not exist', () => {
        let fakeUserId = new ObjectId().toString()
        let recipeId, stepId

        return User.create({ name: 'Harry', email: 'harry@hogwarts.com', username: 'harry', password: 'a123123123' })
            .then(user => {
                return Recipe.create({
                    author: user._id,
                    title: 'Poción de invisibilidad',
                    steps: [{ text: 'Añadir polvo de luna', order: 0 }]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                stepId = recipe.steps[0]._id.toString()

                return reorderStep(fakeUserId, recipeId, stepId, 'down')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('user not found')
            })
    })

    it('fails if recipe does not exist', () => {
        let userId, fakeRecipeId = new ObjectId().toString()

        return User.create({ name: 'Severus Snape', email: 'snape@hogwarts.com', username: 'snape', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return reorderStep(userId, fakeRecipeId, new ObjectId().toString(), 'up')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('recipe not found')
            })
    })

    it('fails if step does not exist', () => {
        let userId, recipeId, fakeStepId = new ObjectId().toString()

        return User.create({ name: 'Ginny Weasley', email: 'ginny@hogwarts.com', username: 'ginny', password: 'a123123123' })
            .then(user => {
                userId = user._id.toString()
                return Recipe.create({
                    author: userId,
                    title: 'Hechizo para volar escobas',
                    steps: [{ text: 'Encantar la escoba', order: 0 }]
                })
            })
            .then(recipe => {
                recipeId = recipe._id.toString()
                return reorderStep(userId, recipeId, fakeStepId, 'up')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('Step not found')
            })
    })


    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))
    after(() => mongoose.disconnect())
})