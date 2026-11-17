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

export type Comment = {
    id: string
    user: { _id: string; username: string }
    text: string
    createdAt: string
    parentId?: string | null
}

export type Nutrition = {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
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
    category?: string
    servings?: number
    tags?: string[]
    ingredients: Ingredient[]
    steps: Step[]
    source?: string
    sourceUrl?: string
    aiNotes?: string
    views?: number
    likes?: number
    likedBy?: string[]
    comments?: Comment[]
    nutrition?: Nutrition
    [key: string]: any
}
