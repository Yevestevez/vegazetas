import '../config/loadEnv.js'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'

import mongoose from 'mongoose'
import { User } from '../data/models.js'

import { errors } from 'com'
const { DuplicityError } = errors

import bcrypt from 'bcryptjs'

import registerUser from './registerUser.js'

describe('registerUser', () => {
    beforeAll(() => mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true }))

    beforeEach(() => User.deleteMany())

    test('succeeds on new user', () => {
        return registerUser('Ana Pérez', 'ana@perez.com', 'anaperez', 'a123123123')
            .then(result => {
                expect(result).to.be.undefined

                return User.findOne()
            })
            .then(user => {
                expect(user.name).to.equal('Ana Pérez')
                expect(user.email).to.equal('ana@perez.com')
                expect(user.username).to.equal('anaperez')

                return bcrypt.compare('a123123123', user.password)
                    .then(match => expect(match).to.be.true)
            })
    })

    test('fails on existing user', () => {
        let catchedError

        return bcrypt.hash('a123123123', 10)
            .then(hash => {
                return User.create({ name: 'Eduardo Yeves', email: 'eduardo@yeves.com', username: 'eduardoyeves', password: 'a123123123' })
                    .then(() => registerUser('Eduardo Yeves', 'eduardo@yeves.com', 'eduardoyeves', 'a123123123'))
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(DuplicityError)
                        expect(catchedError.message).to.equal('user already exists')
                    })
            })
    })

    afterEach(() => User.deleteMany())

    afterAll(() => mongoose.disconnect())
})