import { z } from 'zod'

export const ingredientNameSchema = z.string({ error: 'invalid ingredient name type, must be a string' })
    .refine(name => name.length >= 1 && name.length <= 200,
        'invalid ingredient name length, must be between 1 and 200 characters')
    .regex(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9\s\-_\'(),.%/+&]{1,200}$/,
        'invalid ingredient name syntax')

export const quantitySchema = z.custom<number>(
    value => typeof value === 'number' && !Number.isNaN(value),
    { error: 'invalid quantity type, must be a number', abort: true }
)
    .refine(quantity => quantity > 0 && quantity <= 9999, 'invalid quantity, must be between 0 and 9999')
    .refine(quantity => {
        const [coefficient, exponentText] = quantity.toString().toLowerCase().split('e')
        const decimalLength = (coefficient.split('.')[1]?.length ?? 0) - Number(exponentText ?? 0)
        return decimalLength <= 2
    }, 'invalid quantity, maximum 2 decimal places allowed')

export const mainSchema = z.boolean({ error: 'main must be a boolean (true or false)' })

export const unitSchema = z.union([
    z.string()
        .refine(unit => unit.length <= 20, 'invalid unit length, must be between 1 and 20 characters')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'invalid unit syntax'),
    z.undefined(),
    z.null()
], { error: 'invalid unit type, must be a string' })

export const annotationSchema = z.union([
    z.string().refine(annotation => annotation.length <= 500, 'invalid annotation length, max 500 characters'),
    z.undefined(),
    z.null()
], { error: 'invalid annotation type, must be a string' })
