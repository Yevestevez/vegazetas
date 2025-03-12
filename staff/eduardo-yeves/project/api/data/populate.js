import mongoose from 'mongoose'
import { User, Ingredient, Step, Recipe } from './models.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => Promise.all([User.deleteMany(), Ingredient.deleteMany(), Step.deleteMany(), Recipe.deleteMany()]))
    .then(() => {
        const ana = new User({ name: 'Ana Pérez', email: 'ana@perez.com', username: 'AnaPerez', password: '123123123' })

        const tofu = new Ingredient({ name: 'Tofu', quantity: 500, unit: 'g' })
        const arroz = new Ingredient({ name: 'Arroz', quantity: 200, unit: 'g' })

        const step1 = new Step({ order: 1, text: 'sofríe el tofu hasta que se dore' })

        const tofuCoreano = new Recipe({ author: ana._id, title: 'Tofu Coreano', time: 30, tags: ['tofu', 'coreano', 'picante', 'asiático', 'arroz'], difficulty: 'easy', ingredients: [tofu, arroz], steps: [step1] })

        return Promise.all([ana.save(), tofuCoreano.save()])
    })
    .then(([ana, tofuCoreano]) => {
        console.log('user saved', ana._id)
        console.log('recipe saved', tofuCoreano._id)
    })
    .catch(error => console.error(error))