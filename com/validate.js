import errors from './errors/index.js'
const { ValidationError } = errors

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const USERNAME_REGEX = /^[a-z0-9._-]{1,25}$/
const PASSWORD_REGEX = /^(?!.*[\s])(?=.*\d)(?=.*[a-zA-Z@$-_]).{8,15}$/
const URL_REGEX = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

const validate = {

    id(id, explain = 'id') {
        if (typeof id !== 'string') throw new ValidationError(`invalid ${explain} type, must be a string`)
        if (id.length !== 24) throw new ValidationError(`invalid ${explain} length, must be 24 characters`)
    },

    index(index, explain = 'index') {
        if (!Number.isInteger(index)) throw new ValidationError(`${explain} must be an integer`)
        if (index < 0) throw new ValidationError(`${explain} must be greater than or equal to 0`)
    },

    // User
    name(name) {
        if (typeof name !== 'string') throw new ValidationError('invalid name type, must be a string')
        if (name.length < 1 || name.length > 50) throw new ValidationError('invalid name length, must be between 1 and 50 characters')
    },

    email(email) {
        if (typeof email !== 'string') throw new ValidationError('invalid email type, must be a string')
        if (!EMAIL_REGEX.test(email)) new ValidationError('invalid email syntax')
    },

    username(username) {
        if (typeof username !== 'string') throw new ValidationError('invalid username type, must be a string')
        if (username.length < 1 || username.length > 25) throw new ValidationError('invalid username length, must be between 1 and 25 characters')
        if (!USERNAME_REGEX.test(username)) throw new ValidationError('invalid username syntax')
    },

    password(password) {
        if (typeof password !== 'string') throw new ValidationError('invalid password type, must be a string')
        if (password.length < 8 || password.length > 15) throw new ValidationError('invalid password length, must be between 8 and 15 characters')
        if (!PASSWORD_REGEX.test(password)) throw new ValidationError('invalid password syntax')
    },

    // Recipe
    title(title) {
        if (typeof title !== 'string') throw new ValidationError('invalid title type, must be a string')
        if (title.length < 1 || title.length > 100) throw new ValidationError('invalid title length, must be between 1 and 100 characters')
    },

    // images(images) {
    //     if (!Array.isArray(images)) throw new ValidationError('invalid images type, must be an array')
    //     if (images.length > 3) throw new ValidationError('too many images (max 2)')
    //     if (images.some(image => typeof image !== 'string' || !URL_REGEX.test(image))) throw new ValidationError('invalid images syntax, must be a valid URL')
    // },

    image(image) {
        if (typeof image !== 'string' || !URL_REGEX.test(image)) throw new ValidationError('invalid image syntax, must be a valid URL')
    },

    description(description) {
        if (typeof description !== 'string') throw new ValidationError('invalid description type, must be a string')
        if (description.length < 1 || description.length > 500) throw new ValidationError('invalid description length, must be between 1 and 500 characters')
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

    // tags(tags) {
    //     if (!Array.isArray(tags)) throw new ValidationError('invalid tags type, must be an array')
    //     if (tags.length > 20) throw new ValidationError('too many tags (max 20)')
    //     if (tags.some(tag => typeof tag !== 'string' || tag.length < 1 || tag.length > 20)) throw new ValidationError('each tag must be a string between 1 and 20 characters')
    // },

    tag(tag) {
        if (typeof tag !== 'string' || tag.length < 1 || tag.length > 30) throw new ValidationError('each tag must have between 1 and 20 characters')
    },

    // ingredients(ingredients) {
    //     if (!Array.isArray(ingredients)) throw new ValidationError('invalid ingredients type, must be an array')
    //     if (ingredients.length > 30) throw new ValidationError('too many ingredients (max 30)')
    //     if (ingredients.length < 1) throw new ValidationError('there must be at least one ingredient')
    // },

    // steps(steps) {
    //     if (!Array.isArray(steps)) throw new ValidationError('invalid steps type, must be an array')
    //     if (steps.length > 20) throw new ValidationError('too many steps (max 20)')
    // },

    // Step
    text(text) {
        if (typeof text !== 'string') throw new ValidationError('invalid text type, must be a string')
        if (text.length < 1 || text.length > 300) throw new ValidationError('invalid text length, must be between 1 and 300 characters')
    },

    note(note) {
        if (typeof note !== 'string') throw new ValidationError('invalid note type, must be a string')
        if (note.length < 1 || note.length > 300) throw new ValidationError('invalid note length, must be between 1 and 300 characters')
    },

    image(image) {
        if (typeof image !== 'string') throw new ValidationError('invalid image type, must be a string')
        if (!URL_REGEX.test(image)) throw new ValidationError('invalid image syntax, must be a valid URL')
    },

    // Ingredient
    ingredientName(ingredientName) {
        if (typeof ingredientName !== 'string') throw new ValidationError('invalid ingredientName type, must be a string')
        if (ingredientName.length < 1 || ingredientName.length > 30) throw new ValidationError('invalid ingredientName length, must be between 1 and 30 characters')
    },

    quantity(quantity) {
        if (typeof quantity !== 'number' || !Number.isInteger(quantity)) throw new ValidationError('invalid quantity type, must be a number')
        if (quantity.length < 1 || quantity.length > 6) throw new ValidationError('invalid quantity length, must be between 1 and 6 characters')
        if (quantity <= 0) throw new ValidationError('invalid quantity, must be greater than 0')
    },

    unit(unit) {
        if (unit && typeof unit !== 'string') throw new ValidationError('invalid unit type, must be a string')
        if (unit && (unit.length < 1 || unit.length > 20)) throw new ValidationError('invalid unit length, must be between 1 and 20 characters')
    },

    annotation(annotation) {
        if (annotation && typeof annotation !== 'string') throw new ValidationError('invalid annotation type, must be a string')
        if (annotation && annotation.length > 20) throw new ValidationError('invalid annotation length, max 20 characters')
    },

    main(main) {
        if (typeof main !== 'boolean') {
            throw new ValidationError('main must be a boolean (true or false)')
        }
    }
}

export default validate