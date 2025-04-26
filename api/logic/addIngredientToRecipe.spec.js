import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError } = errors

import addIngredientToRecipe from './addIngredientToRecipe.js'

describe('addIngredientToRecipe', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL));

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]));

    it('succeeds on existing user and recipe', () => {
        let addedIngredientId

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Cerveza de Mantequilla',
                    images: ['https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg'],
                    description: 'Una refrescante cerveza de mantequilla en Las Tres Escobas',
                    time: 45,
                    difficulty: 'difficult',
                    tags: ['cerveza', 'mantequilla', 'las-tres-escobas', 'hogsmeade']
                })
                    .then(recipe => {
                        return addIngredientToRecipe(user._id.toString(), recipe._id.toString(), 'plantequilla', 50, 'g', 'mantequilla vegana', true)
                    })
                    .then((ingredientId) => {
                        addedIngredientId = ingredientId
                        expect(ingredientId).to.be.a('string').with.lengthOf(24)

                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.ingredients)
                        expect(recipe.ingredients).to.be.an('array').with.lengthOf(1)

                        const ingredient = recipe.ingredients[0]

                        expect(ingredient).to.include({
                            name: 'plantequilla',
                            quantity: 50,
                            unit: 'g',
                            annotation: 'mantequilla vegana',
                            main: true
                        });

                        expect(ingredient).to.have.property('_id').that.is.an.instanceOf(ObjectId)
                        expect(ingredient._id.toString()).to.equal(addedIngredientId)
                    })
            })
    })

    it('fails on wrong user', () => {
        let catchedError

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Cerveza de Mantequilla',
                    images: ['https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg'],
                    description: 'Una refrescante cerveza de mantequilla en Las Tres Escobas',
                    time: 45,
                    difficulty: 'difficult',
                    tags: ['cerveza', 'mantequilla', 'las-tres-escobas', 'hogsmeade']
                })
                    .then(recipe => {
                        return addIngredientToRecipe(new ObjectId().toString(), recipe._id.toString(), 'plantequilla', 50, 'g', 'mantequilla vegana', true)
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

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Cerveza de Mantequilla',
                    images: ['https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg'],
                    description: 'Una refrescante cerveza de mantequilla en Las Tres Escobas',
                    time: 45,
                    difficulty: 'difficult',
                    tags: ['cerveza', 'mantequilla', 'las-tres-escobas', 'hogsmeade']
                })
                    .then(recipe => {
                        return addIngredientToRecipe(user._id.toString(), new ObjectId().toString(), 'plantequilla', 50, 'g', 'mantequilla vegana', true)
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('recipe not found')
                    })
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]));

    after(() => mongoose.disconnect());
})