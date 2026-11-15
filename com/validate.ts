import type { ZodType } from 'zod'
import errors from './errors/index.ts'
import {
    annotationSchema, descriptionSchema, difficultySchema, directionSchema, emailSchema, idSchema, imageSchema, indexSchema, ingredientNameSchema, mainSchema, nameSchema, noteSchema,
    passwordSchema, quantitySchema, stepNoteUpdateSchema, tagSchema, textSchema, timeSchema, titleSchema, unitSchema, usernameSchema
} from './schemas.ts'
const { ValidationError } = errors

type ValidateField = (schema: ZodType, value: unknown) => void

const validateField: ValidateField = (schema, value) => {
    const result = schema.safeParse(value)
    if (!result.success) throw new ValidationError(result.error.issues[0].message)
}

const validate = {
    id(id: unknown, explain = 'id') {
        validateField(idSchema(explain), id)
    },

    index(index: unknown, explain = 'index') {
        validateField(indexSchema(explain), index)
    },

    name(name: unknown) {
        validateField(nameSchema, name)
    },

    ingredientName(name: unknown) {
        validateField(ingredientNameSchema, name)
    },

    // User
    email(email: unknown) {
        validateField(emailSchema, email)
    },

    username(username: unknown) {
        validateField(usernameSchema, username)
    },

    password(password: unknown) {
        validateField(passwordSchema, password)
    },

    // Recipe
    title(title: unknown) {
        validateField(titleSchema, title)
    },

    image(image: unknown) {
        validateField(imageSchema, image)
    },

    description(description: unknown) {
        validateField(descriptionSchema, description)
    },

    time(time: unknown) {
        validateField(timeSchema, time)
    },

    difficulty(difficulty: unknown) {
        validateField(difficultySchema, difficulty)
    },

    tag(tag: unknown) {
        const result = tagSchema.safeParse(tag)
        if (!result.success) throw new ValidationError('each tag must have between 1 and 30 characters')
    },

    // Step
    text(text: unknown) {
        validateField(textSchema, text)
    },

    note(note: unknown) {
        validateField(noteSchema, note)
    },

    noteForUpdate(note: unknown) {
        validateField(stepNoteUpdateSchema, note)
    },

    direction(direction: unknown) {
        validateField(directionSchema, direction)
    },

    // Ingredient
    quantity(quantity: unknown) {
        validateField(quantitySchema, quantity)
    },

    unit(unit: unknown) {
        validateField(unitSchema, unit)
    },

    annotation(annotation: unknown) {
        validateField(annotationSchema, annotation)
    },

    main(main: unknown) {
        validateField(mainSchema, main)
    }
}

export default validate
