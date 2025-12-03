import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError } = errors

import getPublishedRecipes from './getPublishedRecipes.js'

describe('getPublishedRecipes', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds returning only published recipes from other users', () => {
        const frodo = new User({ name: 'Frodo', email: 'frodo@shire.com', username: 'Frodo', password: '123123123' })
        const sam = new User({ name: 'Sam', email: 'sam@shire.com', username: 'Sam', password: '123123123' })
        const merry = new User({ name: 'Merry', email: 'merry@shire.com', username: 'Merry', password: '123123123' })

        // Recetas
        const recetaPublicadaSam = new Recipe({
            author: sam._id,
            title: 'Pan de lembas',
            images: ['img1'],
            description: 'Lembas élfico',
            published: true
        })

        const recetaBorradorSam = new Recipe({
            author: sam._id,
            title: 'Sopa secreta',
            images: ['img2'],
            description: 'Solo para hobbits',
            published: false
        })

        const recetaPublicadaMerry = new Recipe({
            author: merry._id,
            title: 'Pastel de zanahoria',
            images: ['img3'],
            description: 'Delicioso',
            published: true
        })

        const recetaPublicadaFrodo = new Recipe({
            author: frodo._id,
            title: 'Tarta de chocolate de Hobbiton',
            images: ['img4'],
            description: 'Mi favorita',
            published: true
        })

        return Promise.all([
            frodo.save(),
            sam.save(),
            merry.save(),
            recetaPublicadaSam.save(),
            recetaBorradorSam.save(),
            recetaPublicadaMerry.save(),
            recetaPublicadaFrodo.save()
        ])
            .then(() => getPublishedRecipes(frodo.id))
            .then(recipes => {
                // Solo deben volver 2 recetas: Sam (publicada) + Merry (publicada)
                expect(recipes).to.have.lengthOf(2)

                const lembas = recipes.find(r => r.title === 'Pan de lembas')
                const pastel = recipes.find(r => r.title === 'Pastel de zanahoria')

                expect(lembas).to.exist
                expect(pastel).to.exist

                // No debe aparecer la de Frodo
                const tartaFrodo = recipes.find(r => r.title === 'Tarta de chocolate de Hobbiton')
                expect(tartaFrodo).to.not.exist

                // No debe aparecer la borrador
                const sopa = recipes.find(r => r.title === 'Sopa secreta')
                expect(sopa).to.not.exist

                // Comprobar estructura
                expect(lembas.author.username).to.equal('Sam')
                expect(lembas.own).to.equal(false)

                expect(pastel.author.username).to.equal('Merry')
                expect(pastel.own).to.equal(false)

                // Campos que NO deben existir
                expect(lembas.description).to.be.undefined
                expect(pastel.description).to.be.undefined
            })
    })

    it('fails on non-existing user', () => {
        let caughtError

        const sam = new User({ name: 'Sam', email: 'sam@shire.com', username: 'Sam', password: '123123123' })

        const recetaPublicadaSam = new Recipe({
            author: sam._id,
            title: 'Pan de lembas',
            images: ['img1'],
            description: 'Lembas élfico',
            published: true
        })

        return Promise.all([
            sam.save(),
            recetaPublicadaSam.save()
        ])
            .then(() => getPublishedRecipes(new ObjectId().toString()))
            .catch(error => caughtError = error)
            .finally(() => {
                expect(caughtError).to.be.instanceOf(NotFoundError)
                expect(caughtError.message).to.equal('user not found')
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    after(() => mongoose.disconnect())
})
