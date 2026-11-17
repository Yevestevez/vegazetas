import { validate, errors } from 'com'

const { NotFoundError, SystemError } = errors

export type FindUserById = (userId: string) => Promise<any | null>
export type SaveRecipe = (data: {
    author: string
    title: string
    images?: string[]
    description?: string
    time?: number
    difficulty?: string
    tags?: string[]
    category?: string
    servings?: number
    source?: string
    sourceUrl?: string
    aiNotes?: string
}) => Promise<string>

export type CreateRecipe = (userId: unknown, title: unknown, images?: unknown, description?: unknown, time?: unknown, difficulty?: unknown, tags?: unknown, category?: unknown, servings?: unknown, source?: unknown, sourceUrl?: unknown, aiNotes?: unknown) => Promise<string>

export function createCreateRecipe(
    findUserById: FindUserById,
    saveRecipe: SaveRecipe
): CreateRecipe {
    return (userId, title, images, description, time, difficulty, tags, category, servings, source, sourceUrl, aiNotes) => {
        validate.id(userId, 'userId')
        validate.title(title)
        if (description) validate.description(description)
        if (time !== undefined) validate.time(time)
        if (difficulty) validate.difficulty(difficulty)
        if (category) validate.category(category)
        if (servings !== undefined) validate.servings(servings)
        if (source) validate.source(source)
        if (sourceUrl) validate.sourceUrl(sourceUrl)
        if (aiNotes) validate.aiNotes(aiNotes)

        return findUserById(userId as string)
            .catch(error => { throw new SystemError(error.message) })
            .then(user => {
                if (!user) throw new NotFoundError('user not found')

                return saveRecipe({
                    author: user._id,
                    title: title as string,
                    images: images as string[] | undefined,
                    description: description as string | undefined,
                    time: time as number | undefined,
                    difficulty: difficulty as string | undefined,
                    tags: tags as string[] | undefined,
                    category: category as string | undefined,
                    servings: servings as number | undefined,
                    source: source as string | undefined,
                    sourceUrl: sourceUrl as string | undefined,
                    aiNotes: aiNotes as string | undefined
                })
            })
    }
}
