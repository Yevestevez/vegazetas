import type { Request, Response, NextFunction } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export type AddIngredientHandler = (req: Request, res: Response, next: NextFunction) => void
export type RemoveIngredientHandler = (req: Request, res: Response, next: NextFunction) => void

export function createAddIngredientHandler(
    addIngredientToRecipe: (userId: string | undefined, recipeId: string | undefined, name: unknown, quantity: unknown, unit?: unknown, annotation?: unknown, main?: unknown) => Promise<string>
): AddIngredientHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const recipeId = req.params.recipeId as string
            const { name, quantity, unit, annotation, main } = req.body

            addIngredientToRecipe(userId, recipeId, name, quantity, unit, annotation, main)
                .then(ingredientId => res.status(201).json(ingredientId))
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}

export function createRemoveIngredientHandler(
    removeIngredientFromRecipe: (userId: string | undefined, recipeId: string | undefined, ingredientId: string | undefined) => Promise<void>
): RemoveIngredientHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const recipeId = req.params.recipeId as string
            const ingredientId = req.params.ingredientId as string

            removeIngredientFromRecipe(userId, recipeId, ingredientId)
                .then(() => res.status(204).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}
