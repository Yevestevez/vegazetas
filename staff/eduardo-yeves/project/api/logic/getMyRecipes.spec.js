import 'dotenv/config'

import { expect } from 'chai'

import mongoose from 'mongoose'
import { User, Recipe } from '../data/models.js'
const { Types: { ObjectId } } = mongoose

import { errors } from 'com'
const { NotFoundError } = errors

import getMyRecipes from './getMyRecipes.js'

describe('getMyRecipes', () => {
    before(() => mongoose.connect(process.env.TEST_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    it('succeeds on existing user and recipes', () => {
        const frodo = new User({ name: 'Frodo Baggins', email: 'frodo@baggins.com', username: 'FrodoBaggins', password: '123123123' })
        const sam = new User({ name: 'Sam Gamgee', email: 'sam@gamgee.com', username: 'SamGamgee', password: '123123123' })

        const tartaChocolate = new Recipe({ author: frodo._id, title: 'Tarta de Chocolate', images: ['https://imgs.search.brave.com/QpOYgtpncZrDgnvxV4K2SHllqfKs_7eXfL4gqMV9qcw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWFyaWFsdW5hcmls/bG9zLmNvbS9ibG9n/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzExL3ZpZGVvLXJl/Y2V0YS10YXJ0YS1j/aG9jb2xhdGUtMi5q/cGc', 'https://imgs.search.brave.com/7uAra_rL51b-Y9No2S04RMnqW0nfheaWT7IlNpQ-VEs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWxwbHVyYWwuY29t/L3VwbG9hZHMvczEv/MTYvOTgvMTIvNC9y/ZWNldGEtdGFydGEt/Y2hvY29sYXRlLmpw/ZWc'], description: 'La mejor tarta de chocolate de La Comarca', time: 150, difficulty: 'medium', tags: ['tarta', 'chocolate', 'postre', 'cacao'] })
        const calabazaGigante = new Recipe({ author: sam._id, title: 'Calabaza gigante', images: ['https://imgs.search.brave.com/gQZAj-PRUF0b09_PAL6XY4S0qyyVJsunXmHwxByovEg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFrRGJSRHlJaEwu/anBn'], description: 'La calabaza más enorme de Hobbiton', time: 50, difficulty: 'easy', tags: ['calabaza', 'gigante', 'hobbiton', 'huerto'] })
        const hierbaDelViejoToby = new Recipe({ author: frodo._id, title: 'Hierba del viejo Toby', images: ['https://imgs.search.brave.com/ot2jLxQhgIfJTqaix0rNp3aYhMzUTLKW1514S0ADbH8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGluYWZlbS5vcmcv/dXBsb2Fkcy92YXJp/ZWRhZGVzLWhvYmJp/dC1tYXJpaHVhbmFf/YmxvZ19mdWxsLmpw/Zw'], description: 'La mejor cepa de La Comarca', time: 15, difficulty: 'easy', tags: ['hierba', 'toby', 'tabaco', 'no-te-precipites'] })

        return Promise.all([
            frodo.save(),
            sam.save(),
            tartaChocolate.save(),
            calabazaGigante.save(),
            hierbaDelViejoToby.save()
        ])
            .then(([frodo, sam, tartaChocolate, calabazaGigante, hierbaDelViejoToby]) => {
                return getMyRecipes(frodo.id)
                    .then(recipes => {
                        expect(recipes).to.have.lengthOf(2)

                        const tartaChocolateB = recipes.find(recipe => recipe.id === tartaChocolate.id)
                        expect(tartaChocolateB.author.id).to.equal(frodo.id)
                        expect(tartaChocolateB.author.username).to.equal(frodo.username)
                        expect(tartaChocolateB.title).to.equal(tartaChocolate.title)
                        expect(tartaChocolateB.images).to.deep.equal(tartaChocolate.images)
                        expect(tartaChocolateB.description).to.be.undefined
                        expect(tartaChocolateB.time).to.be.undefined
                        expect(tartaChocolateB.difficulty).to.be.undefined
                        expect(tartaChocolateB.tags).to.be.undefined

                        const calabazaGiganteB = recipes.find(recipe => recipe.id === calabazaGigante.id)
                        expect(calabazaGiganteB).to.not.exist

                        const hierbaDelViejoTobyB = recipes.find(recipe => recipe.id === hierbaDelViejoToby.id)
                        expect(hierbaDelViejoTobyB.author.id).to.equal(frodo.id)
                        expect(hierbaDelViejoTobyB.author.username).to.equal(frodo.username)
                        expect(hierbaDelViejoTobyB.tittle).to.equal(hierbaDelViejoToby.tittle)
                        expect(hierbaDelViejoTobyB.images).to.deep.equal(hierbaDelViejoToby.images)
                        expect(hierbaDelViejoTobyB.description).to.be.undefined
                        expect(hierbaDelViejoTobyB.time).to.be.undefined
                        expect(hierbaDelViejoTobyB.difficulty).to.be.undefined
                        expect(hierbaDelViejoTobyB.tags).to.be.undefined
                    })
            })
    })

    it('fails on non-existing user', () => {
        let catchedError

        const frodo = new User({ name: 'Frodo Baggins', email: 'frodo@baggins.com', username: 'FrodoBaggins', password: '123123123' })
        const sam = new User({ name: 'Sam Gamgee', email: 'sam@gamgee.com', username: 'SamGamgee', password: '123123123' })

        const tartaChocolate = new Recipe({ author: frodo._id, title: 'Tarta de Chocolate', images: ['https://imgs.search.brave.com/QpOYgtpncZrDgnvxV4K2SHllqfKs_7eXfL4gqMV9qcw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWFyaWFsdW5hcmls/bG9zLmNvbS9ibG9n/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzExL3ZpZGVvLXJl/Y2V0YS10YXJ0YS1j/aG9jb2xhdGUtMi5q/cGc', 'https://imgs.search.brave.com/7uAra_rL51b-Y9No2S04RMnqW0nfheaWT7IlNpQ-VEs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWxwbHVyYWwuY29t/L3VwbG9hZHMvczEv/MTYvOTgvMTIvNC9y/ZWNldGEtdGFydGEt/Y2hvY29sYXRlLmpw/ZWc'], description: 'La mejor tarta de chocolate de La Comarca', time: 150, difficulty: 'medium', tags: ['tarta', 'chocolate', 'postre', 'cacao'] })
        const calabazaGigante = new Recipe({ author: sam._id, title: 'Calabaza gigante', images: ['https://imgs.search.brave.com/gQZAj-PRUF0b09_PAL6XY4S0qyyVJsunXmHwxByovEg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFrRGJSRHlJaEwu/anBn'], description: 'La calabaza más enorme de Hobbiton', time: 50, difficulty: 'easy', tags: ['calabaza', 'gigante', 'hobbiton', 'huerto'] })
        const hierbaDelViejoToby = new Recipe({ author: frodo._id, title: 'Hierba del viejo Toby', images: ['https://imgs.search.brave.com/ot2jLxQhgIfJTqaix0rNp3aYhMzUTLKW1514S0ADbH8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGluYWZlbS5vcmcv/dXBsb2Fkcy92YXJp/ZWRhZGVzLWhvYmJp/dC1tYXJpaHVhbmFf/YmxvZ19mdWxsLmpw/Zw'], description: 'La mejor cepa de La Comarca', time: 15, difficulty: 'easy', tags: ['hierba', 'toby', 'tabaco', 'no-te-precipites'] })

        return Promise.all([
            frodo.save(),
            sam.save(),
            tartaChocolate.save(),
            calabazaGigante.save(),
            hierbaDelViejoToby.save()
        ])
            .then(([frodo, sam, tartaChocolate, calabazaGigante, hierbaDelViejoToby]) => getMyRecipes(new ObjectId().toString()))
            .catch(error => catchedError = error)
            .finally(() => {
                expect(catchedError).to.be.instanceOf(NotFoundError);
                expect(catchedError.message).to.equal('user not found');
            })
    })

    afterEach(() => Promise.all([User.deleteMany(), Recipe.deleteMany()]))

    after(() => mongoose.disconnect())
})