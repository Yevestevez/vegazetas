import 'dotenv/config'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'

import mongoose from 'mongoose'
import { User } from '../data/models.js'

import { errors } from 'com'
const { CredentialsError } = errors

import bcrypt from 'bcryptjs'

import authenticateUser from './authenticateUser.js'

describe('authenticateUser', () => {
    beforeAll(() => mongoose.connect(process.env.SPEC_MONGO_URL, { directConnection: true }))

    beforeEach(() => User.deleteMany())

    test('succeeds on existing user', () => {
        return bcrypt.hash('a123123123', 10)
            .then(hash => User.create({ name: 'Ana Pérez', email: 'ana@perez.com', username: 'anaperez', password: hash }))
            .then(() => authenticateUser('ana@perez.com', 'a123123123'))
            .then(userId => {
                expect(userId).to.be.a('string').with.lengthOf(24)

                return User.findById(userId)
            })
            .then(user => {
                expect(user.email).to.equal('ana@perez.com')

                return bcrypt.compare('a123123123', user.password)
            })
            .then(match => expect(match).to.be.true)
    })

    test('fails on wrong email', () => {
        let catchedError

        return bcrypt.hash('a123123123', 10)
            .then(hash => User.create({ name: 'Eduardo Yeves', email: 'eduardo@yeves.com', username: 'eduardoyeves', password: hash }))
            .then(() => authenticateUser('edu@yeves.com', 'a123123123'))
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).instanceOf(CredentialsError)
                expect(catchedError.message).to.be.equal('wrong credentials')
            })
    })

    test('fails on wrong password', () => {
        let catchedError

        return bcrypt.hash('a123123123', 10)
            .then(hash => User.create({ name: 'Harry Potter', email: 'harry@potter.com', username: 'harrypotter', password: hash }))
            .then(() => authenticateUser('harry@potter.com', 'a123123123X'))
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).instanceOf(CredentialsError)
                expect(catchedError.message).to.equal('wrong credentials')
            })
    })

    afterEach(() => User.deleteMany())

    afterAll(() => mongoose.disconnect())
})