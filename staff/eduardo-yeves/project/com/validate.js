import errors from './errors/index.js'
const { ValidationError } = errors

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const USERNAME_REGEX = /^[a-z0-9_-]{1,30}$/
const PASSWORD_REGEX = /^((?!.*[\s])(?=.*[a-zA-Z0-9])(?=.*\d).{8,15})/
const URL_REGEX = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

const validate = {

    id(id, explain = 'id') {
        if (typeof id !== 'string') throw new Error(`invalid ${explain} type`)
        if (id.length < 10) throw new Error(`invalid ${explain} length`)
    },

    // User
    name(name) {
        if (typeof name !== 'string') throw new ValidationError('invalid name type')
        if (name.length < 1 || name.length > 30) throw new ValidationError('invalid name length')
    },

    email(email) {
        if (typeof email !== 'string') throw new ValidationError('invalid email type')
        if (!EMAIL_REGEX.test(email)) new ValidationError('invalid email syntax')
    },

    username(username) {
        if (typeof username !== 'string') throw new ValidationError('invalid username type')
        if (!USERNAME_REGEX.test(username)) throw new ValidationError('invalid username syntax')
        if (username.length < 1 || username.length > 25) throw new ValidationError('invalid username length')
    },

    password(password) {
        if (typeof password !== 'string') throw new ValidationError('invalid password type')
        if (!PASSWORD_REGEX.test(password)) throw new ValidationError('invalid password syntax')
    },

    // Recipe
    title(title) {
        if (typeof title !== 'string') throw new ValidationError('invalid title type')
        if (title.length < 1 || title.length > 80) throw new ValidationError('invalid title length')
    },

    images(images) {
        if (!Array.isArray(images)) throw new ValidationError('invalid images type')
        if (images.length > 6) throw new ValidationError('too many images (max 6)')
        if (images.some(image => typeof image !== 'string' || !URL_REGEX.test(image))) throw new ValidationError('invalid images syntax')
    },

    description(description) {
        if (typeof description !== 'string') throw new ValidationError('invalid description type')
        if (description.length < 1 || description.length > 300) throw new ValidationError('invalid description length')
    },

    time(time) {
        if (typeof time !== 'number' || !Number.isInteger(time)) throw new ValidationError('invalid time type')
        if (time.length < 1 || time.length > 4) throw new ValidationError('invalid time length')
        if (time <= 0) throw new ValidationError('invalid time')
    },

    difficulty(difficulty) {
        if (typeof difficulty !== 'string') throw new ValidationError('invalid difficulty type')
        if (!['easy', 'medium', 'difficult'].includes(difficulty)) throw new ValidationError('invalid difficulty (must be easy, medium or difficult)')
    },

    tags(tags) {
        if (!Array.isArray(tags)) throw new ValidationError('invalid tags type')
        if (tags.length > 20) throw new ValidationError('too many tags (max 20)')
        if (tags.some(tag => typeof tag !== 'string' || tag.length < 1 || tag.length > 20)) throw new ValidationError('each tag must be a string between 1 and 20 characters')
    },

    ingredients(ingredients) {
        if (!Array.isArray(ingredients)) throw new ValidationError('invalid ingredients type')
        if (ingredients.length > 30) throw new ValidationError('too many ingredients (max 30)')
        if (ingredients.length < 1) throw new ValidationError('there must be at least one ingredient')
    },

    steps(steps) {
        if (!Array.isArray(steps)) throw new ValidationError('invalid steps type')
        if (steps.length > 20) throw new ValidationError('too many steps (max 20)')
    },

    // Step
    text(text) {
        if (typeof text !== 'string') throw new ValidationError('invalid text type')
        if (text.length < 1 || text.length > 300) throw new ValidationError('invalid text length')
    },

    note(note) {
        if (typeof note !== 'string') throw new ValidationError('invalid note type')
        if (note.length < 1 || note.length > 300) throw new ValidationError('invalid note length')
    },

    image(image) {
        if (typeof image !== 'string') throw new ValidationError('invalid image type')
        if (!URL_REGEX.test(image)) throw new ValidationError('invalid image syntax')
    },

    // Ingredient
    ingredientName(ingredientName) {
        if (typeof ingredientName !== 'string') throw new ValidationError('invalid ingredientName type')
        if (ingredientName.length < 1 || ingredientName.length > 30) throw new ValidationError('invalid ingredientName length')
    },

    quantity(quantity) {
        if (typeof quantity !== 'number' || !Number.isInteger(quantity)) throw new ValidationError('invalid quantity type')
        if (quantity.length < 1 || quantity.length > 6) throw new ValidationError('invalid quantity length')
        if (quantity <= 0) throw new ValidationError('invalid quantity')
    },

    unit(unit) {
        if (unit && typeof unit !== 'string') throw new ValidationError('invalid unit type')
        if (unit && (unit.length < 1 || unit.length > 20)) throw new ValidationError('invalid unit length')
    },

    annotation(annotation) {
        if (annotation && typeof annotation !== 'string') throw new ValidationError('invalid annotation type')
        if (annotation && annotation.length > 20) throw new ValidationError('invalid annotation length, max 20 characters')
    },

    main(main) {
        if (typeof main !== 'boolean') {
            throw new ValidationError('main must be a boolean (true or false)')
        }
    }
}

export default validate