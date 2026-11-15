export type Ingredient = {
    id: string
    name: string
    quantity: number
    unit: string
    annotation?: string
    main: boolean
}

export type Step = {
    id: string
    text: string
    note?: string
    image?: string
    order?: number
}

export type RecipeListItem = {
    id: string
    title: string
    published: boolean
    isFavorite: boolean
    images: string[]
    date: string
    [key: string]: any
}

export type RecipeListItemWithAuthor = RecipeListItem & {
    author: { username: string }
    own?: boolean
}

export type RecipeData = {
    id: string
    title: string
    published: boolean
    isFavorite?: boolean
    own?: boolean
    images: string[]
    author?: { username: string }
    date?: string
    description?: string
    time?: number
    difficulty?: string
    tags?: string[]
    ingredients: Ingredient[]
    steps: Step[]
    [key: string]: any
}
