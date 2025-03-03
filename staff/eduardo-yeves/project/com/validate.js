import { Ingredient } from '../api/data/models.js'
import errors from './errors/index.js'

const { ValidationError } = errors

const validate = {

    name(name) {
        // string
        // longitud >1 <20
    },

    username(username) {
        if (typeof username !== 'string') throw new ValidationError('invalid username type')
        // longitud >4 <20
    },

    email(email) {
        // string
        // longitud >6 <30
        // tiene @
    },

    password(password) {
        // string
        // longitud >8 <20
    },

    quantity(quantity) {
        // number
        // longitud >0 <20
    },

    unit(unit) {
        // string
        // longitud >0 <20
    },

    note(note) {
        // string
        // longitud >0 <300
    },

    text(text) {
        // string
        // longitud >0 <300
    },

    image(image) {
        // string
        // longitud >0 <150
    },
    tags(tags) {
        // array
    },
    difficulty(difficulty) {
        // string
    },
    Ingredients(ingredients) {
        // array
    },
    steps(steps) {
        // array
    }
}