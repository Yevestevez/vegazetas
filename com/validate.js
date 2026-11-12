import errors from './errors/index.js'
import {
    annotationSchema, descriptionSchema, difficultySchema, emailSchema, imageSchema, mainSchema, nameSchema, noteSchema,
    quantitySchema, stepNoteUpdateSchema, tagSchema, textSchema, timeSchema, titleSchema, unitSchema, usernameSchema
} from './schemas.ts'
const { ValidationError } = errors

const PASSWORD_REGEX = /^(?=\S+$)(?=.*[A-Za-z])(?=.*\d).{8,25}$/

const validateField = (schema, value) => {
    const result = schema.safeParse(value)
    if (!result.success) throw new ValidationError(result.error.issues[0].message)
}

const validate = {
    id(id, explain = 'id') {
        if (typeof id !== 'string') throw new ValidationError(`invalid ${explain} type, must be a string`)
        if (id.length !== 24) throw new ValidationError(`invalid ${explain} length, must be 24 characters`)
    },

    index(index, explain = 'index') {
        if (!Number.isInteger(index)) throw new ValidationError(`${explain} must be an integer`)
        if (index < 0) throw new ValidationError(`${explain} must be greater than or equal to 0`)
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
        if (typeof password !== 'string') throw new ValidationError('invalid password type, must be a string')
        if (password.length < 8 || password.length > 25) throw new ValidationError('invalid password length, must be between 8 and 25 characters')
        if (!PASSWORD_REGEX.test(password)) throw new ValidationError('invalid password syntax')
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