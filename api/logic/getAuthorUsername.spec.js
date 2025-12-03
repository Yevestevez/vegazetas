import 'dotenv/config'
import { expect } from 'chai'

import mongoose from 'mongoose'
import { User } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError } = errors

import getAuthorUsername from './getAuthorUsername.js'

describe('getAuthorUsername', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => User.deleteMany())

    it('succeeds on existing author', () => {
        return User.create({
            name: 'Harry Potter',
            email: 'harry@hogwarts.com',
            username: 'harrypotter',
            password: '123123123'
        })
            .then(user => getAuthorUsername(user._id.toString()))
            .then(username => expect(username).to.equal('harrypotter'))
    })

    it('fails on non-existing author', () => {
        let catchedError

        return User.create({
            name: 'Harry Potter',
            email: 'harry@hogwarts.com',
            username: 'harrypotter',
            password: '123123123'
        })
            .then(() => getAuthorUsername(new ObjectId().toString()))
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).to.be.instanceOf(NotFoundError)
                expect(catchedError.message).to.equal('user not found')
            })
    })

    afterEach(() => User.deleteMany())

    after(() => mongoose.disconnect())
})