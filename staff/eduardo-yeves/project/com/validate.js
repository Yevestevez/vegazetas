import errors from './errors/index.js'
const { ValidationError } = errors

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const USERNAME_REGEX = /^[a-z0-9_-]{1,30}$/
const PASSWORD_REGEX = /^((?!.*[\s])(?=.*[a-zA-Z0-9])(?=.*\d).{8,15})/
const URL_REGEX = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

const validate = {

    name(name) {
        if (typeof name !== 'string') throw new ValidationError('invalid name type')
        if (name.length < 1 || name.length > 30) throw new ValidationError('invalid name length')
    },

    username(username) {
        if (typeof username !== 'string') throw new ValidationError('invalid username type')
        if (!USERNAME_REGEX.test(username)) throw new ValidationError('invalid username syntax')
    },

    email(email) {
        if (typeof email !== 'string') throw new ValidationError('invalid email type')
        if (!EMAIL_REGEX.test(email)) new ValidationError('invalid email syntax')
    },

    password(password) {
        if (typeof password !== 'string') throw new ValidationError('invalid password type')
        if (!PASSWORD_REGEX.test(password)) throw new ValidationError('invalid password syntax')
    },

    quantity(quantity) {
        if (typeof quantity !== 'number' || !Number.isInteger(quantity)) throw new ValidationError('invalid quantity type')
        if (quantity.length < 1 || quantity.length > 10) throw new ValidationError('invalid quantity length')
        if (quantity <= 0) throw new ValidationError('invalid quantity')
    },

    unit(unit) {
        if (typeof unit !== 'string') throw new ValidationError('invalid unit type')
        if (unit.length < 1 || unit.length > 20) throw new ValidationError('invalid unit lenght')
    },

    note(note) {
        if (typeof note !== 'string') throw new ValidationError('invalid note type')
        if (note.length < 1 || note.length > 400) throw new ValidationError('invalid note length')
    },

    text(text) {
        if (typeof text !== 'string') throw new ValidationError('invalid text type')
        if (text.length < 1 || text.length > 300) throw new ValidationError('invalid text length')
    },

    image(image) {
        if (typeof image !== 'string') throw new ValidationError('invalid image type')
        if (!URL_REGEX.test(image)) throw new ValidationError('invalid image syntax')
    },

    tags(tags) {
        if (!Array.isArray(tags)) throw new ValidationError('invalid tags type')
        if (tags.length > 20) throw new ValidationError('too many tags (max 20)')
        if (tags.some(tag => typeof tag !== 'string' || tag.length < 1 || tag.length > 20)) throw new ValidationError('each tag must be a string between 1 and 20 characters')
    },

    difficulty(difficulty) {
        if (typeof difficulty !== 'string') throw new ValidationError('invalid difficulty type')
        if (difficulty !== 'easy' | difficulty !== 'medium' | difficulty !== 'difficult') throw new ValidationError('invalid difficulty (must be easy, medium or difficult')
    },

    Ingredients(ingredients) {
        if (!Array.isArray(ingredients)) throw new ValidationError('invalid ingredients type')
        if (ingredients.length > 30) throw new ValidationError('too many ingredients (max 30)')
    },

    steps(steps) {
        if (!Array.isArray(steps)) throw new ValidationError('invalid steps type')
        if (steps.length > 20) throw new ValidationError('too many steps (max 20)')
    },

    annotation(annotation) {
        if (typeof annotation !== 'string') throw new ValidationError('invalid annotation type')
        if (annotation.length < 20) throw new ValidationError('invalid annotation length')
    }
}

export default validate