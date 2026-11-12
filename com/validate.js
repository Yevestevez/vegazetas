import errors from './errors/index.js'
import {
    annotationSchema, descriptionSchema, difficultySchema, emailSchema, idSchema, imageSchema, indexSchema, mainSchema, nameSchema, noteSchema,
    passwordSchema, quantitySchema, stepNoteUpdateSchema, tagSchema, textSchema, timeSchema, titleSchema, unitSchema, usernameSchema
} from './schemas.ts'
const { ValidationError } = errors

const validateField = (schema, value) => {
    const result = schema.safeParse(value)
    if (!result.success) throw new ValidationError(result.error.issues[0].message)
}

const validate = {
    id(id, explain = 'id') {
        validateField(idSchema(explain), id)
    },

    index(index, explain = 'index') {
        validateField(indexSchema(explain), index)
    },

    name(name) {
        validateField(nameSchema, name)
    },

    // User
    email(email) {
        validateField(emailSchema, email)
    },

    username(username) {
        validateField(usernameSchema, username)
    },

    password(password) {
        validateField(passwordSchema, password)
    },

    // Recipe
    title(title) {
        validateField(titleSchema, title)
    },

    image(image) {
        validateField(imageSchema, image)
    },

    description(description) {
        validateField(descriptionSchema, description)
    },

    time(time) {
        validateField(timeSchema, time)
    },

    difficulty(difficulty) {
        validateField(difficultySchema, difficulty)
    },

    tag(tag) {
        const result = tagSchema.safeParse(tag)
        if (!result.success) throw new ValidationError('each tag must have between 1 and 20 characters')
    },

    // Step
    text(text) {
        validateField(textSchema, text)
    },

    note(note) {
        validateField(noteSchema, note)
    },

    noteForUpdate(note) {
        validateField(stepNoteUpdateSchema, note)
    },

    direction(direction) {
        if (direction !== 'up' && direction !== 'down')
            throw new Error('direction must be "up" or "down"')
    },

    // Ingredient
    quantity(quantity) {
        validateField(quantitySchema, quantity)
    },

    unit(unit) {
        validateField(unitSchema, unit)
    },

    annotation(annotation) {
        validateField(annotationSchema, annotation)
    },

    main(main) {
        validateField(mainSchema, main)
    }
}

export default validate