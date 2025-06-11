import 'dotenv/config'
import { expect } from 'chai'
import mongoose from 'mongoose'
import { User } from '../data/models.js'
import { errors } from 'com'
import bcrypt from 'bcryptjs'
import recoverPassword from './recoverPassword.js'

const { NotFoundError, ValidationError } = errors

describe('recoverPassword', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => User.deleteMany())

    it('succeeds on existing user', () => {
        let user

        return bcrypt.hash('123123123', 10)
            .then(hash => {
                return User.create({
                    name: 'Ana Pérez',
                    email: 'ana@perez.com',
                    username: 'anaperez',
                    password: hash
                })
            })
            .then(createdUser => {
                user = createdUser

                return recoverPassword('ana@perez.com')
            })
            .then(result => {
                expect(result).to.be.undefined

                return User.findById(user._id)
            })
            .then(updatedUser => {
                expect(updatedUser.resetPasswordToken).to.exist
                expect(updatedUser.resetPasswordToken).to.have.lengthOf(64) // 32 bytes hex = 64 chars
                expect(updatedUser.resetPasswordExpires).to.exist
            })
    })

    it('fails on non existing user', () => {
        let catchedError

        return recoverPassword('nonexistent@email.com')
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).to.be.instanceOf(NotFoundError)
                expect(catchedError.message).to.equal('user not found')
            })
    })

    afterEach(() => User.deleteMany())

    after(() => mongoose.disconnect())
})