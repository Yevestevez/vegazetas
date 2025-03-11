import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError } = errors

import createRecipe from './createRecipe.js'

describe('createRecipe', () => {
    before(() => mongoose.connect(process.env.TEST_MONGO_URL));

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]));

    it('succeeds on existing user', () => {
        return User.create({ name: 'Ana Pérez', email: 'ana@perez.com', username: 'anaperez', password: '123123123' })
            .then(user => {
                return createRecipe(
                    user._id.toString(),
                    'Tofu coreano', // title
                    ['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg', 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'], // images
                    'Descripción de la receta', // description
                    35, // time
                    'easy', // difficulty (easy | medium | difficult)
                    ['tofu', 'coreano', 'arroz', 'picante'], // tags
                    ['tofu', 'arroz', 'cebolla', 'salsa de soja'], // ingredients
                    [{ text: 'sofríe el tofu!' }] // steps
                )
                    .then(result => {
                        expect(result).to.be.undefined

                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.author.toString()).to.equal(user._id.toString())
                        expect(recipe.title).to.equal('Tofu coreano')
                        expect(recipe.images).to.deep.equal(['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg', 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'])
                        expect(recipe.description).to.equal('Descripción de la receta')
                        expect(recipe.time).to.equal(35)
                        expect(recipe.difficulty).to.equal('easy')
                        expect(recipe.tags).to.deep.equal(['tofu', 'coreano', 'arroz', 'picante'])
                        expect(recipe.ingredients).to.deep.equal(['tofu', 'arroz', 'cebolla', 'salsa de soja'])
                        //expect(recipe.steps).to.deep.equal([{ text: 'sofríe el tofu!' }])
                    })
            })
    })

    it('fails on wrong user', () => {
        let catchedError

        return User.create({ name: 'Ana Pérez', email: 'ana@perez.com', username: 'anaperez', password: '123123123' })
            .then(user => {
                return createRecipe(
                    new ObjectId().toString(),
                    'Tofu coreano', // title
                    ['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg', 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'], // images
                    'Descripción de la receta', // description
                    35, // time
                    'easy', // difficulty (easy | medium | difficult)
                    ['tofu', 'coreano', 'arroz', 'picante'], // tags
                    ['tofu', 'arroz', 'cebolla', 'salsa de soja'], // ingredients
                    [{ text: 'sofríe el tofu!' }] // steps
                )
            })
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).to.be.instanceOf(NotFoundError)
                expect(catchedError.message).to.equal('user not found')
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]));

    after(() => mongoose.disconnect());
})