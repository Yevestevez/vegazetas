import 'dotenv/config'
import { expect } from 'chai'
import mongoose from 'mongoose'
import { User } from '../data/models.js'
import { errors } from 'com'
import bcrypt from 'bcryptjs'
import passwordRecover from './passwordRecover.js'

const { NotFoundError } = errors

describe('passwordRecover', function () {
    this.timeout(10000)

    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => User.deleteMany())

    it('succeeds on existing user and sends email with token link', done => {
        let consoleOutput = ''
        const originalConsoleLog = console.log
        console.log = (...args) => { consoleOutput += args.join(' ') + '\n' }

        bcrypt.hash('123123123', 10)
            .then(hash => {
                return User.create({
                    name: 'Ana Pérez',
                    email: 'ana@perez.com',
                    username: 'anaperez',
                    password: hash
                })
            })
            .then(user => {
                return passwordRecover('ana@perez.com')
                    .then(() => {
                        console.log = originalConsoleLog // restaurar console.log

                        return User.findOne({ email: 'ana@perez.com' })
                    })
                    .then(() => {
                        // Validar que consoleOutput tiene el link de Ethereal
                        const previewUrlMatch = consoleOutput.match(/https:\/\/ethereal.email\/message\/[^\s]+/)
                        expect(previewUrlMatch).to.exist
                        const previewUrl = previewUrlMatch[0]
                        expect(previewUrl).to.include('ethereal.email/message/')

                        done()
                    })
            })
            .catch(error => {
                console.log = originalConsoleLog
                done(error)
            })
    })

    it('fails on non existing user', done => {
        passwordRecover('nonexistent@email.com')
            .then(() => done(new Error('Should have thrown')))
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('user not found')
                done()
            })
    })

    afterEach(() => User.deleteMany())

    after(() => mongoose.disconnect())
})