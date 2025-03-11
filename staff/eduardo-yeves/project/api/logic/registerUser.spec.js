import 'dotenv/config'
import { expect } from 'chai'

import mongoose from 'mongoose'
import { User } from '../data/models.js'

import { errors } from 'com'
const { DuplicityError } = errors

import bcrypt from 'bcryptjs'

import registerUser from './registerUser.js'

describe('registerUser', () => {
    before(() => mongoose.connect(process.env.TEST_MONGO_URL))

    beforeEach(() => User.deleteMany())

    it('succeeds on new user', () => {
        return registerUser('Ana Pérez', 'ana@perez.com', 'anaperez', '123123123')
            .then(result => {
                expect(result).to.be.undefined

                return User.findOne()
            })
            .then(user => {
                expect(user.name).to.equal('Ana Pérez')
                expect(user.email).to.equal('ana@perez.com')
                expect(user.username).to.equal('anaperez')

                return bcrypt.compare('123123123', user.password)
                    .then(match => expect(match).to.be.true)
            })
    })

    it('fails on existing user', () => {
        let catchedError

        return bcrypt.hash('123123123', 10)
            .then(hash => {
                return User.create({ name: 'Eduardo Yeves', email: 'eduardo@yeves.com', username: 'eduardoyeves', password: '123123123' })
                    .then(() => registerUser('Eduardo Yeves', 'eduardo@yeves.com', 'eduardoyeves', '123123123'))
                    .catch(error => catchedError = error)
                    .finally(() => {
                        expect(catchedError).to.be.instanceOf(DuplicityError)
                        expect(catchedError.message).to.equal('user already exists')
                    })
            })
    })

    afterEach(() => User.deleteMany())

    after(() => mongoose.disconnect())
})