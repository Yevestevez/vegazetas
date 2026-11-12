import errors from './errors/index.js'
import {
    annotationSchema, descriptionSchema, difficultySchema, imageSchema, mainSchema, nameSchema, noteSchema,
    quantitySchema, stepNoteUpdateSchema, tagSchema, textSchema, timeSchema, titleSchema, unitSchema
} from './schemas.ts'
const { ValidationError } = errors

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const USERNAME_REGEX = /^[a-z0-9._-]{1,25}$/
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
        if (typeof email !== 'string') throw new ValidationError('invalid email type, must be a string')
        if (!EMAIL_REGEX.test(email)) throw new ValidationError('invalid email syntax')
    },

    username(username) {
        if (typeof username !== 'string') throw new ValidationError('invalid username type, must be a string')
        if (username.length < 1 || username.length > 25) throw new ValidationError('invalid username length, must be between 1 and 25 characters')
        if (!USERNAME_REGEX.test(username)) throw new ValidationError('invalid username syntax (solo minúsculas, números, guiones, guiones bajos o puntos, sin espacios. Máx. 25 caracteres)')
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