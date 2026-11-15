import type { Request, Response, NextFunction } from 'express'
import { errors } from 'com'
import { getSessionUserId } from '../../../util/getSessionUserId.ts'

const { CredentialsError } = errors

export type TogglePublishHandler = (req: Request, res: Response, next: NextFunction) => void

export function createTogglePublishHandler(togglePublishRecipe: (userId: string | undefined, recipeId: string | undefined) => Promise<{ published: boolean }>): TogglePublishHandler {
    return (req, res, next) => {
        const userId = getSessionUserId(req.headers.authorization)
        const recipeId = String(req.params.recipeId)

        togglePublishRecipe(userId, recipeId)
            .then(result => res.status(200).json(result))
            .catch(error => {
                if (error instanceof CredentialsError) {
                    res.set('WWW-Authenticate', 'Bearer')
                    res.status(401).json({ error: 'CredentialsError', message: error.message })
                } else {
                    next(error)
                }
            })
    }
}
