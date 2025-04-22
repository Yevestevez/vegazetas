import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError } = errors

import addStepToRecipe from './addStepToRecipe.js'

describe('addStepToRecipe', () => {
    before(() => mongoose.connect(process.env.TEST_MONGO_URL));

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]));

    it('succeeds on existing user and recipe', () => {
        let addedStepId

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
                        return addStepToRecipe(user._id.toString(), recipe._id.toString(), 'Mezclamos la harina con el cacao en polvo', 'que quede todo bien mezclado y sin grumos', 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg')
                    })
                    .then((stepId) => {
                        addedStepId = stepId
                        expect(stepId).to.be.a('string').with.lengthOf(24)

                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.steps).to.be.an('array').with.lengthOf(1)

                        const step = recipe.steps[0]

                        expect(step).to.include({
                            text: 'Mezclamos la harina con el cacao en polvo',
                            note: 'que quede todo bien mezclado y sin grumos',
                            image: 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'
                        });

                        expect(step).to.have.property('_id').that.is.an.instanceOf(ObjectId)

                        expect(step._id.toString()).to.equal(addedStepId)
                    })
            })
    })

    it('fails on wrong user', () => {
        let catchedError

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
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
                        return addStepToRecipe(new ObjectId().toString(), recipe._id.toString(), 'Mezclamos la harina con el cacao en polvo', 'que quede todo bien mezclado y sin grumos', 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg')
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
                    title: 'Tarta de chocolate',
                    images: ['https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg'],
                    description: 'La mejor tarta de chocolate de Slytherin',
                    time: 120,
                    difficulty: 'difficult',
                    tags: ['tarta', 'postre', 'slytherin']
                })
                    .then(recipe => {
                        return addStepToRecipe(user._id.toString(), new ObjectId().toString(), 'Mezclamos la harina con el cacao en polvo', 'que quede todo bien mezclado y sin grumos', 'https://www.elplural.com/uploads/s1/16/98/12/6/receta-tarta-chocolate_4_800x450.jpeg')
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