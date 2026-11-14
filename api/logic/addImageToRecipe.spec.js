import '../config/loadEnv.js'

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError, OwnershipError } = errors

import addImageToRecipe from './addImageToRecipe.js'

describe('addImageToRecipe', () => {
    beforeAll(() => mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true }));

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]));

    test('succeeds on existing user and recipe', () => {
        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(user => {
                return Recipe.create({
                    author: user.id,
                    title: 'Cerveza de Mantequilla',
                    images: ['https://th.bing.com/th/id/R.ccbc36ab98f04c4f1ab1a8efa533c491?rik=%2fr7GA%2bNlPPDoiA&riu=http%3a%2f%2fwizardingworldpark.com%2fwp-content%2fuploads%2f2011%2f11%2fIMG_0956.jpg&ehk=3GKgUMHg6d9gqP7Yvx%2bzpSczZbHULFar6dror4luiR4%3d&risl=&pid=ImgRaw&r=0'],
                    description: 'Una refrescante cerveza de mantequilla en Las Tres Escobas',
                    time: 45,
                    difficulty: 'difficult',
                    tags: ['cerveza', 'mantequilla', 'las-tres-escobas', 'hogsmeade']
                })
                    .then(recipe => {
                        return addImageToRecipe(user._id.toString(), recipe._id.toString(), 'https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg')
                    })
                    .then((result) => {
                        expect(result).to.be.undefined

                        return Recipe.findOne()
                    })
                    .then(recipe => {
                        expect(recipe.images).to.be.an('array').with.lengthOf(2)
                        expect(recipe.images[1]).to.equal('https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg')
                    })
            })
    })

    test('fails on wrong user', () => {
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
                        return addImageToRecipe(new ObjectId().toString(), recipe._id.toString(), 'https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg')
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('user not found')
                    })
            })
    })

    test('fails on wrong recipe', () => {
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
                        return addImageToRecipe(user._id.toString(), new ObjectId().toString(), 'https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg')
                    })
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(NotFoundError)
                        expect(catchedError.message).to.equal('recipe not found')
                    })
            })
    })

    test('fails when user is not the author', () => {
        let catchedError

        return User.create({ name: 'Ron Weasley', email: 'ron@weasley.com', username: 'ronweasley', password: '123123123' })
            .then(author => {
                return User.create({ name: 'Harry Potter', email: 'harry@potter.com', username: 'harrypotter', password: '123123123' })
                    .then(otherUser => {
                        return Recipe.create({
                            author: author.id,
                            title: 'Cerveza de Mantequilla',
                            images: ['https://www.forbeerslovers.com/images/posts/-d14beb495479cf5c27c523a9130a4229.jpg'],
                            description: 'Una refrescante cerveza de mantequilla en Las Tres Escobas',
                            time: 45,
                            difficulty: 'difficult',
                            tags: ['cerveza', 'mantequilla']
                        })
                            .then(recipe => {
                                return addImageToRecipe(otherUser._id.toString(), recipe._id.toString(), 'https://example.com/other.jpg')
                            })
                            .catch(error => catchedError = error)
                            .finally(() => {
                                expect(catchedError).to.be.instanceOf(OwnershipError)
                                expect(catchedError.message).to.equal('user is not author of recipe')
                            })
                    })
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]));

    afterAll(() => mongoose.disconnect());
})