import mongoose from 'mongoose'
import { User, Ingredient, Step, Recipe } from './models.js'

import 'dotenv/config'

import bcrypt from 'bcryptjs'

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => Promise.all([User.deleteMany(), Ingredient.deleteMany(), Step.deleteMany(), Recipe.deleteMany()]))
    .then(() => {
        return bcrypt.hash('a123123123', 10)
            .then(hash => {
                // users
                const ana = new User({ name: 'Ana Pérez', email: 'ana@perez.com', username: 'anaperez', password: hash })
                const edu = new User({ name: 'Eduardo Yeves', email: 'edu@yeves.com', username: 'eduyeves', password: hash })

                // TOFU COREANO
                // ingredients - Tofu coreano
                const tofu = new Ingredient({ name: 'Tofu', quantity: 400, unit: 'g', annotation: '2 bloques pequeños' })
                const cebolla = new Ingredient({ name: 'Cebolla', quantity: 2, unit: 'uds' })
                const ajo = new Ingredient({ name: 'Ajo', quantity: 6, unit: 'uds', annotation: 'dientes', main: false })
                const salsaSoja = new Ingredient({ name: 'Salsa de soja', quantity: 1, unit: 'chorro', main: false })
                const azucarMoreno = new Ingredient({ name: 'Azúcar moreno', quantity: 4, unit: 'cucharadas', main: false })
                const salsaTomate = new Ingredient({ name: 'Salsa de tomate', quantity: '300', unit: 'g', annotation: 'medio bote', main: false })
                const aceiteOliva = new Ingredient({ name: 'Aceite de oliva', quantity: 2, unit: 'cucharadas', main: false })
                const sal = new Ingredient({ name: 'Sal', quantity: 1, unit: 'cucharada', main: false })
                const pimientaNegra = new Ingredient({ name: 'Pimienta Negra', quantity: 1, unit: 'cucharadita', main: false })
                const salsaGochujang = new Ingredient({ name: 'Salsa Gochujang', quantity: '1', unit: 'cucharada', annotation: 'se puede sustituir por Sriracha u otro picante', main: false })
                const semillasSesamo = new Ingredient({ name: 'Semillas de sesamo', quantity: '4', unit: 'cucharadas', main: false })
                const cebollino = new Ingredient({ name: 'Cebollino', quantity: 4, unit: 'cucharadas', main: false })
                const arroz = new Ingredient({ name: 'Arroz', quantity: 2, unit: 'vasos pequeños', main: false })

                // steps - Tofu coreano (con orden consecutivo)
                const tofuCoreanoStep1 = new Step({ text: 'Secar tofu y sofreír con un toque de sal y pimienta', image: 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-2.jpg', order: 1 })
                const tofuCoreanoStep2 = new Step({ text: 'Mezclar azúcar, soja, salsa de tomate y salsa gochujang', note: 'Si es demasiado denso añadir agua', order: 2 })
                const tofuCoreanoStep3 = new Step({ text: 'Añadir tofu, sofreír con la salsa y reservar', order: 3 })
                const tofuCoreanoStep4 = new Step({ text: 'Picar la cebolla en trozos no demasiado pequeños y los ajos bien picados', order: 4 })
                const tofuCoreanoStep5 = new Step({ text: 'Sofreir cebolla y ajos con un poco de aceite', order: 5 })
                const tofuCoreanoStep6 = new Step({ text: 'Añadir mezcla de tofu y salsa dejando espesar unos minutos', image: 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-3.jpg', order: 6 })
                const tofuCoreanoStep7 = new Step({ text: 'Cocer arroz y servir con tofu por encima', order: 7 })
                const tofuCoreanoStep8 = new Step({ text: 'Decorar con sésamo y cebollino', order: 8 })

                // recipe - Tofu coreano
                const tofuCoreano = new Recipe({
                    author: ana._id,
                    title: 'Tofu coreano',
                    images: ['https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg', 'https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg'],
                    time: 30,
                    tags: ['tofu', 'coreano', 'tofu-picante'],
                    difficulty: 'easy',
                    ingredients: [tofu, cebolla, ajo, salsaSoja, azucarMoreno, salsaTomate, aceiteOliva, sal, pimientaNegra, salsaGochujang, semillasSesamo, cebollino, arroz],
                    steps: [tofuCoreanoStep1, tofuCoreanoStep2, tofuCoreanoStep3, tofuCoreanoStep4, tofuCoreanoStep5, tofuCoreanoStep6, tofuCoreanoStep7, tofuCoreanoStep8]
                })

                // TURRÓN DEL REY TRUFÓN
                // ingredients - Turrón del rey Trufón
                const chocolatePostre = new Ingredient({ name: 'Chocolate de postre', quantity: 200, unit: 'g', annotation: 'se puede sustituir por chocolate blanco' })
                const galletasOreo = new Ingredient({ name: 'Galletas Oreo', quantity: 150, unit: 'g' })
                const quesoCremaVegano = new Ingredient({ name: 'Queso crema vegano', quantity: 60, unit: 'g' })

                // steps - Turrón del rey Trufón (con orden consecutivo)
                const turronReyTrufonStep1 = new Step({ text: 'Derretir chocolate', order: 1 })
                const turronReyTrufonStep2 = new Step({ text: 'Cubrir un molde con una capa fina y dejar enfriar en la nevera', order: 2 })
                const turronReyTrufonStep3 = new Step({ text: 'Triturar galletas', order: 3 })
                const turronReyTrufonStep4 = new Step({ text: 'Mezclar queso crema y polvo de galleta', order: 4 })
                const turronReyTrufonStep5 = new Step({ text: 'Añadir la mezcla al molde con el chocolate ya frío', order: 5 })
                const turronReyTrufonStep6 = new Step({ text: 'Cubrir la mezcla con una segunda capa de chocolate y volver a enfriar', order: 6 })

                // recipe - Turrón del rey Trufón
                const turronReyTrufon = new Recipe({
                    author: ana._id,
                    title: 'Turrón del rey Trufón',
                    time: 20,
                    tags: ['chocolate', 'turrón', 'postre'],
                    difficulty: 'easy',
                    ingredients: [chocolatePostre, galletasOreo, quesoCremaVegano],
                    steps: [turronReyTrufonStep1, turronReyTrufonStep2, turronReyTrufonStep3, turronReyTrufonStep4, turronReyTrufonStep5, turronReyTrufonStep6]
                })

                return Promise.all([ana.save(), edu.save(), tofuCoreano.save(), turronReyTrufon.save()])
            })
    })
    .then(([ana, edu, tofuCoreano, turronReyTrufon]) => {
        console.log('user saved', ana._id)
        console.log('user saved', edu._id)
        console.log('recipe saved', tofuCoreano._id)
        console.log('recipe saved', turronReyTrufon._id)

        // Mostrar IDs de los steps para usar en tests
        console.log('\n=== STEPS IDs para testing ===')
        console.log('Tofu Coreano Steps:')
        tofuCoreano.steps.forEach((step, index) => {
            console.log(`  Step ${step.order}: ${step._id} - "${step.text.substring(0, 30)}..."`)
        })

        console.log('\nTurrón del Rey Trufón Steps:')
        turronReyTrufon.steps.forEach((step, index) => {
            console.log(`  Step ${step.order}: ${step._id} - "${step.text.substring(0, 30)}..."`)
        })
    })
    .catch(error => console.error(error))