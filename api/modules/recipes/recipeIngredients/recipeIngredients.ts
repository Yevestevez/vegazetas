import { errors, validate } from 'com'

const { NotFoundError, SystemError, OwnershipError, ValidationError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type FindRecipeById = (recipeId: string) => Promise<any | null>
export type AddIngredient = (recipeId: string, ingredient: { name: string; quantity: string; unit: string; annotation: string; main: boolean }) => Promise<string>
export type RemoveIngredient = (recipeId: string, ingredientId: string) => Promise<void>

export type AddIngredientToRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    name: unknown,
    quantity: unknown,
    unit?: unknown,
    annotation?: unknown,
    main?: unknown
) => Promise<string>

export type RemoveIngredientFromRecipe = (
    userId: string | undefined,
    recipeId: string | undefined,
    ingredientId: string | undefined
) => Promise<void>

export function createAddIngredientToRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    addIngredient: AddIngredient
): AddIngredientToRecipe {
    return (userId, recipeId, name, quantity, unit, annotation, main) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.ingredientName(name)
        validate.quantity(quantity)
        validate.unit(unit)
        if (annotation !== undefined && annotation !== null) validate.annotation(annotation)
        if (main !== undefined) validate.main(main)

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                return findRecipeById(recipeId as string)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipe => {
                        if (!recipe) throw new NotFoundError('recipe not found')

                        if (recipe.author.toString() !== userId)
                            throw new OwnershipError('user is not author of recipe')

                        return addIngredient(recipeId as string, {
                            name: name as string,
                            quantity: String(quantity),
                            unit: (unit ?? '') as string,
                            annotation: (annotation ?? '') as string,
                            main: Boolean(main ?? false)
                        })
                    })
            })
    }
}

export function createRemoveIngredientFromRecipe(
    findUserById: FindUserById,
    findRecipeById: FindRecipeById,
    removeIngredient: RemoveIngredient
): RemoveIngredientFromRecipe {
    return (userId, recipeId, ingredientId) => {
        validate.id(userId, 'userId')
        validate.id(recipeId, 'recipeId')
        validate.id(ingredientId, 'ingredientId')

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                return findRecipeById(recipeId as string)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(recipe => {
                        if (!recipe) throw new NotFoundError('recipe not found')

                        if (recipe.author.toString() !== userId)
                            throw new OwnershipError('user is not author of recipe')

                        return removeIngredient(recipeId as string, ingredientId as string)
                    })
            })
    }
}
