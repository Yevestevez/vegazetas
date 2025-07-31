import mongoose from 'mongoose'
const { Schema, model, Types: { ObjectId } } = mongoose

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const ingredient = new Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number
    },
    unit: {
        type: String
    },
    annotation: {
        type: String
    },
    main: {
        type: Boolean,
        required: true,
        default: true
    }
})

const step = new Schema({
    text: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    image: {
        type: String
    },
    order: {
        type: Number
    }
})

const recipe = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    images: [{
        type: String
    }],
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
    },
    time: {
        type: Number,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'difficult']
    },
    tags: [{
        type: String
    }],
    ingredients: [
        ingredient
    ],
    steps: [
        step
    ]
})

const User = model('User', user)
const Ingredient = model('Ingredient', ingredient)
const Step = model('Step', step)
const Recipe = model('Recipe', recipe)


export {
    User,
    Ingredient,
    Step,
    Recipe,
}