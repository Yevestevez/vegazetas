import type { Request, Response, NextFunction } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.js'

export type AddStepHandler = (req: Request, res: Response, next: NextFunction) => void
export type RemoveStepHandler = (req: Request, res: Response, next: NextFunction) => void
export type UpdateStepHandler = (req: Request, res: Response, next: NextFunction) => void
export type ReorderStepHandler = (req: Request, res: Response, next: NextFunction) => void

export function createAddStepHandler(
    addStepToRecipe: (userId: string | undefined, recipeId: string | undefined, text: unknown, note?: unknown, image?: unknown) => Promise<string>
): AddStepHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId } = req.params
            const { text, note, image } = req.body

            addStepToRecipe(userId, recipeId, text, note, image)
                .then(stepId => res.status(201).json(stepId))
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}

export function createRemoveStepHandler(
    removeStepFromRecipe: (userId: string | undefined, recipeId: string | undefined, stepId: string | undefined) => Promise<void>
): RemoveStepHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId, stepId } = req.params

            removeStepFromRecipe(userId, recipeId, stepId)
                .then(() => res.status(204).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}

export function createUpdateStepHandler(
    updateStepInRecipe: (userId: string | undefined, recipeId: string | undefined, stepId: string | undefined, text: unknown, note?: unknown, image?: unknown) => Promise<void>
): UpdateStepHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId, stepId } = req.params
            const { text, note, image } = req.body

            updateStepInRecipe(userId, recipeId, stepId, text, note, image)
                .then(() => res.status(204).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}

export function createReorderStepHandler(
    reorderStepInRecipe: (userId: string | undefined, recipeId: string | undefined, stepId: string | undefined, direction: unknown) => Promise<void>
): ReorderStepHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId, stepId } = req.params
            const { direction } = req.body

            reorderStepInRecipe(userId, recipeId, stepId, direction)
                .then(() => res.status(204).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}
