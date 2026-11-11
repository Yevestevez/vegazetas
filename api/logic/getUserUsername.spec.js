import 'dotenv/config'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'

import mongoose from 'mongoose'
import { User } from '../data/models.js'
const { Types: { ObjectId } } = mongoose;

import { errors } from 'com'
const { NotFoundError } = errors

import getUserUsername from './getUserUsername.js'

describe('getUserUsername', () => {
    beforeAll(() => mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true }))

    beforeEach(() => User.deleteMany())

    test('succeeds on existing user', () => {
        return User.create({ name: 'Hermione Granger', email: 'hermione@granger.com', username: 'hermionegranger', password: '123123123' })
            .then(user => getUserUsername(user._id.toString()))
            .then(username => expect(username).to.equal('hermionegranger'))
    })

    test('fails on wrong user id', () => {
        let catchedError

        return User.create({ name: 'Hermione Granger', email: 'hermione@granger.com', username: 'hermionegranger', password: '123123123' })
            .then(user => getUserUsername(new ObjectId().toString()))
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).to.be.instanceOf(NotFoundError)
                expect(catchedError.message).to.equal('user not found')
            })
    })

    afterEach(() => User.deleteMany())

    afterAll(() => mongoose.disconnect())
})