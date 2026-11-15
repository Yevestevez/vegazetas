import mongoose, { Schema, model, Types } from 'mongoose'

const ingredientSchema = new Schema({
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

const stepSchema = new Schema({
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

const recipeSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
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
        ingredientSchema
    ],
    steps: [
        stepSchema
    ],
    published: {
        type: Boolean,
        required: true,
        default: false
    }
})

const userSchema = new Schema({
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
    },
    favorites: {
        type: [Types.ObjectId],
        ref: 'Recipe',
        default: []
    }
})

export type IngredientDocument = mongoose.InferSchemaType<typeof ingredientSchema> & {
    _id: Types.ObjectId
}

export type StepDocument = mongoose.InferSchemaType<typeof stepSchema> & {
    _id: Types.ObjectId
}

export type RecipeDocument = mongoose.InferSchemaType<typeof recipeSchema> & {
    _id: Types.ObjectId
}

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> & {
    _id: Types.ObjectId
}

const User = model<UserDocument>('User', userSchema)
const Ingredient = model<IngredientDocument>('Ingredient', ingredientSchema)
const Step = model<StepDocument>('Step', stepSchema)
const Recipe = model<RecipeDocument>('Recipe', recipeSchema)

export {
    User,
    Ingredient,
    Step,
    Recipe,
}
