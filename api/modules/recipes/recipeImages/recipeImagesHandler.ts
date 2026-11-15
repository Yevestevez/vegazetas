import type { Request, Response, NextFunction } from 'express'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

export type AddImageHandler = (req: Request, res: Response, next: NextFunction) => void
export type RemoveImageHandler = (req: Request, res: Response, next: NextFunction) => void

export function createAddImageHandler(
    addImageToRecipe: (userId: string | undefined, recipeId: string | undefined, image: unknown) => Promise<void>
): AddImageHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId } = req.params
            const { image } = req.body

            addImageToRecipe(userId, recipeId, image)
                .then(() => res.status(201).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}

export function createRemoveImageHandler(
    removeImageFromRecipe: (userId: string | undefined, recipeId: string | undefined, index: string | undefined) => Promise<void>
): RemoveImageHandler {
    return (req, res, next) => {
        try {
            const userId = getSessionUserId(req.headers.authorization)
            const { recipeId, index } = req.params

            removeImageFromRecipe(userId, recipeId, index)
                .then(() => res.status(204).send())
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}
