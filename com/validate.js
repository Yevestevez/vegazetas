import errors from './errors/index.js'
const { ValidationError } = errors

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const USERNAME_REGEX = /^[a-z0-9._-]{1,25}$/
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/
const PASSWORD_REGEX = /^(?=\S+$)(?=.*[A-Za-z])(?=.*\d).{8,25}$/
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
const UNIT_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/

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
        if (typeof name !== 'string') throw new ValidationError('invalid name type, must be a string')
        if (name.length < 1 || name.length > 50) throw new ValidationError('invalid name length, must be between 1 and 50 characters')
        if (!NAME_REGEX.test(name)) throw new ValidationError('invalid name syntax')
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
        if (typeof title !== 'string') throw new ValidationError('invalid title type, must be a string')
        if (title.length < 1 || title.length > 50) throw new ValidationError('invalid title length, must be between 1 and 50 characters')
    },

    image(image) {
        if (typeof image !== 'string') throw new ValidationError('invalid image type, must be a string')
        if (!URL_REGEX.test(image)) throw new ValidationError('invalid image syntax, must be a valid URL')
    },

    description(description) {
        if (typeof description !== 'string') throw new ValidationError('invalid description type, must be a string')
        if (description.length > 500) throw new ValidationError('invalid description length, must be 500 characters maximum')
    },

    time(time) {
        if (typeof time !== 'number' || !Number.isInteger(time)) throw new ValidationError('invalid time type, must be a number')
        if (time.length < 1 || time.length > 4) throw new ValidationError('invalid time length, minimum 1 minute, maximum 9999 minutes')
        if (time < 5) throw new ValidationError('invalid time, minimum 5 minutes')
    },

    difficulty(difficulty) {
        if (typeof difficulty !== 'string') throw new ValidationError('invalid difficulty type, must be a string')
        if (!['easy', 'medium', 'difficult'].includes(difficulty)) throw new ValidationError('invalid difficulty (must be easy, medium or difficult)')
    },

    tag(tag) {
        if (typeof tag !== 'string' || tag.length < 1 || tag.length > 30) throw new ValidationError('each tag must have between 1 and 20 characters')
    },

    // Step
    text(text) {
        if (typeof text !== 'string') throw new ValidationError('invalid text type, must be a string')
        if (text.length < 1 || text.length > 800) throw new ValidationError('invalid text length, must be between 1 and 800 characters')
    },

    note(note) {
        if (typeof note !== 'string') throw new ValidationError('invalid note type, must be a string')
        if (note.length < 1 || note.length > 500) throw new ValidationError('invalid note length, must be between 1 and 500 characters')
    },

    direction(direction) {
        if (direction !== 'up' && direction !== 'down')
            throw new Error('direction must be "up" or "down"')
    },

    // Ingredient
    quantity(quantity) {
        if (typeof quantity !== 'number' || isNaN(quantity)) throw new ValidationError('invalid quantity type, must be a number')
        if (quantity <= 0 || quantity > 9999) throw new ValidationError('invalid quantity, must be between 0 and 9999')

        const parts = quantity.toString().split('.')
        if (parts[1]?.length > 2) {
            throw new ValidationError('invalid quantity, maximum 2 decimal places allowed')
        }
    },

    unit(unit) {
        if (unit && typeof unit !== 'string') throw new ValidationError('invalid unit type, must be a string')
        if (unit && (unit.length < 1 || unit.length > 20)) throw new ValidationError('invalid unit length, must be between 1 and 20 characters')
        if (!UNIT_REGEX.test(unit)) throw new ValidationError('invalid unit syntax')
    },

    annotation(annotation) {
        if (annotation && typeof annotation !== 'string') throw new ValidationError('invalid annotation type, must be a string')
        if (annotation && annotation.length > 300) throw new ValidationError('invalid annotation length, max 300 characters')
    },

    main(main) {
        if (typeof main !== 'boolean') {
            throw new ValidationError('main must be a boolean (true or false)')
        }
    }
}

export default validate