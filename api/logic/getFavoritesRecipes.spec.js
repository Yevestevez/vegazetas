import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError } = errors

import getFavoritesRecipes from './getFavoritesRecipes.js'

describe('getFavoritesRecipes', () => {
    before(() => mongoose.connect(process.env.SPEC_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds returning favorite recipes respecting visibility rules', () => {
        const frodo = new User({ name: 'Frodo', email: 'frodo@shire.com', username: 'Frodo', password: '123123123' })
        const sam = new User({ name: 'Sam', email: 'sam@shire.com', username: 'Sam', password: '123123123' })

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

        const recetaBorradorFrodo = new Recipe({
            author: frodo._id,
            title: 'Guiso privado',
            images: ['img3'],
            description: 'Top secret',
            published: false
        })

        return Promise.all([
            frodo.save(),
            sam.save(),
            recetaPublicadaSam.save(),
            recetaBorradorSam.save(),
            recetaBorradorFrodo.save()
        ])
            .then(() => {
                // Favoritos de Frodo:
                // - receta publicada de Sam (OK)
                // - receta borrador de Sam (NO debe volver)
                // - su propia receta borrador (OK)
                frodo.favorites = [
                    recetaPublicadaSam._id,
                    recetaBorradorSam._id,
                    recetaBorradorFrodo._id
                ]

                return frodo.save()
            })
            .then(() => getFavoritesRecipes(frodo.id))
            .then(recipes => {
                // Solo deben volver 2
                expect(recipes).to.have.lengthOf(2)

                const lembas = recipes.find(r => r.title === 'Pan de lembas')
                const guiso = recipes.find(r => r.title === 'Guiso privado')
                const sopa = recipes.find(r => r.title === 'Sopa secreta')

                expect(lembas).to.exist
                expect(guiso).to.exist
                expect(sopa).to.not.exist

                // Pan de lembas (otro autor, publicada)
                expect(lembas.author.username).to.equal('Sam')
                expect(lembas.own).to.equal(false)
                expect(lembas.isFavorite).to.equal(true)
                expect(lembas.published).to.equal(true)

                // Guiso privado (propio autor, no publicada)
                expect(guiso.author.username).to.equal('Frodo')
                expect(guiso.own).to.equal(true)
                expect(guiso.isFavorite).to.equal(true)
                expect(guiso.published).to.equal(false)

                // Campos que NO deben existir
                expect(lembas.description).to.be.undefined
                expect(guiso.description).to.be.undefined
            })
    })

    it('fails on non-existing user', () => {
        let caughtError

        return getFavoritesRecipes(new ObjectId().toString())
            .catch(error => caughtError = error)
            .finally(() => {
                expect(caughtError).to.be.instanceOf(NotFoundError)
                expect(caughtError.message).to.equal('user not found')
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    after(() => mongoose.disconnect())
})