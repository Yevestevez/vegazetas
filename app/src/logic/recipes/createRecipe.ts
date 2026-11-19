import authenticatedFetch from '../authenticatedFetch'
import { validate, errors } from 'com'

const createRecipe = (
    userId: string,
    title: string,
    images: string[] | undefined,
    description: string | undefined,
    time: number | undefined,
    difficulty: string | undefined,
    tags: string[] | undefined,
    category: string | undefined,
    servings: number | undefined
): Promise<string> => {
    validate.id(userId, 'userId')
    validate.title(title)
    if (description) validate.description(description)
    if (time !== undefined) validate.time(time)
    if (difficulty) validate.difficulty(difficulty)
    if (category) validate.category(category)
    if (servings !== undefined) validate.servings(servings)

    return authenticatedFetch(`${import.meta.env.VITE_API_URL}/recipes`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            images,
            description,
            time,
            difficulty,
            tags,
            category,
            servings
        })
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 201)
                return res.json()
                    .then((recipeId: string) => recipeId)

            return res.json()
                .then((body: { error: string; message: string }) => {
                    const { error, message } = body

                    const constructor = errors[error as keyof typeof errors]

                    throw new constructor(message)
                })
        })
}

export default createRecipe
