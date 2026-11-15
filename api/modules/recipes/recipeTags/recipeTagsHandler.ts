import type { Request, Response, NextFunction } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.js'

export type AddTagHandler = (req: Request, res: Response, next: NextFunction) => void
export type RemoveTagHandler = (req: Request, res: Response, next: NextFunction) => void

export function createAddTagHandler(
    addTagToRecipe: (userId: string | undefined, recipeId: string | undefined, tag: unknown) => Promise<void>
): AddTagHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId } = req.params
            const { tag } = req.body

            addTagToRecipe(userId, recipeId, tag)
                .then(() => res.status(201).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}

export function createRemoveTagHandler(
    removeTagFromRecipe: (userId: string | undefined, recipeId: string | undefined, index: string | undefined) => Promise<void>
): RemoveTagHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId, index } = req.params

            removeTagFromRecipe(userId, recipeId, index)
                .then(() => res.status(204).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}
