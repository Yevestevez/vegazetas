import mongoose, { Schema, model, Types } from 'mongoose'

// ---------------------------------------------------------------------------
// Subdocumentos embebidos (no se registran como modelos independientes)
// ---------------------------------------------------------------------------

const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 200
    },
    quantity: {
        type: Number
    },
    unit: {
        type: String,
        maxlength: 50
    },
    annotation: {
        type: String,
        maxlength: 500
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
        required: true,
        maxlength: 5000
    },
    note: {
        type: String,
        maxlength: 2000
    },
    image: {
        type: String
    },
    order: {
        type: Number
    }
})

// ---------------------------------------------------------------------------
// Recipe
// ---------------------------------------------------------------------------

const recipeSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            maxlength: 200
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
            maxlength: 5000
        },
        time: {
            type: Number
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'difficult']
        },
        category: {
            type: String,
            enum: ['entrante', 'principal', 'postre', 'sopa', 'ensalada', 'snack', 'bebida', 'otro'],
            maxlength: 50
        },
        servings: {
            type: Number,
            min: 1,
            max: 100
        },
        tags: [{
            type: String,
            lowercase: true,
            trim: true
        }],
        ingredients: [ingredientSchema],
        steps: [stepSchema],
        published: {
            type: Boolean,
            required: true,
            default: false
        },
        source: {
            type: String,
            enum: ['manual', 'ai-generated', 'url-import'],
            default: 'manual'
        },
        sourceUrl: {
            type: String,
            maxlength: 2000
        },
        aiNotes: {
            type: String,
            maxlength: 2000
        },
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: {
            type: [Schema.Types.ObjectId],
            ref: 'User'
        },
        comments: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true,
                maxlength: 1000
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            parentId: {
                type: Schema.Types.ObjectId,
                default: null
            }
        }],
        nutrition: {
            calories: { type: Number },
            protein: { type: Number },
            carbs: { type: Number },
            fat: { type: Number }
        }
    },
    { timestamps: true }
)

// Índices compuestos para consultas frecuentes
// Mis recetas ordenadas por fecha
recipeSchema.index({ author: 1, date: -1 })
// Recetas publicadas de otros, ordenadas por fecha
recipeSchema.index({ author: 1, published: 1, date: -1 })
// Evita duplicados de título por autor (dos usuarios pueden tener "Paella")
recipeSchema.index({ author: 1, title: 1 }, { unique: true })
// Búsqueda full-text por título, descripción y tags
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' })
// Filtros por ingredientes (array embebido)
recipeSchema.index({ 'ingredients.name': 1 })
// Filtros por dificultad
recipeSchema.index({ difficulty: 1 })
// Filtros por tiempo de preparación
recipeSchema.index({ time: 1 })
// Filtrar por categoría de plato
recipeSchema.index({ category: 1 })
// Filtrar recetas generadas por IA
recipeSchema.index({ source: 1, createdAt: -1 })
// Ordenar por popularidad (likes)
recipeSchema.index({ likes: -1, published: 1 })
// Ordenar por vistas
recipeSchema.index({ views: -1, published: 1 })

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        favorites: {
            type: [Types.ObjectId],
            ref: 'Recipe',
            default: []
        },
        bio: {
            type: String,
            maxlength: 500
        },
        avatar: {
            type: String,
            maxlength: 500
        },
        socialLinks: {
            twitter: { type: String, maxlength: 200 },
            instagram: { type: String, maxlength: 200 },
            website: { type: String, maxlength: 200 }
        }
    },
    { timestamps: true }
)

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Modelos exportados
// Nota: Ingredient y Step son subdocumentos embebidos en Recipe.
// Ya no se registran como modelos independientes.
// ---------------------------------------------------------------------------

const User = model<UserDocument>('User', userSchema)
const Recipe = model<RecipeDocument>('Recipe', recipeSchema)

export {
    User,
    Recipe,
}
