import { validate, errors } from 'com'

const createRecipe = (
    userId,
    title,
    images,
    description,
    time,
    difficulty,
    tags
) => {
    validate.id(userId, 'userId')
    validate.title(title)
    if (images) validate.images(images)
    if (description) validate.description(description)
    if (time) validate.time(time)
    if (difficulty) validate.difficulty(difficulty)
    if (tags) validate.tags(tags)

    return fetch(`${import.meta.env.VITE_API_URL}/recipes`, {
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
            tags
        })
    })
        .catch(error => { throw new Error(error.message) })
        .then(res => {
            const { status } = res

            if (status === 201) return;

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error];

                    throw new constructor(message)
                })
        })
}

export default createRecipe