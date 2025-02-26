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

const recipe = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    images: [{
        type: String
    }],
    description: {
        type: String,
    },
    time: {
        type: Number,
        required: true
    },
    tags: [{
        type: String,
        required: true
    }],
    difficulty: {
        type: String,
        required: true
    },
    ingredients: [{
        type: Object({
            name: {
                type: String,
                required: true,
                unique: true,
            },
            quantity: {
                type: Number
            },
            unit: {
                type: String
            },
            note: {
                type: String
            },
            main: {
                type: Boolean,
                required: true,
                default: true
            }
        })
    }],
    steps: [{
        type: Object({
            order: {
                type: Number
            },
            text: {
                type: String,
                required: true
            },
            note: {
                type: String,
            },
            image: {
                type: String
            }
        })
    }]
})

const User = model('User', user)
const Recipe = model('Recipe', recipe)

export {
    User,
    Recipe
}