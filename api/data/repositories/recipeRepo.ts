import { Recipe, User } from '../models.ts'
import type { RecipeDocument, StepDocument } from '../models.ts'

export const findRecipeById = (recipeId: string) =>
    Recipe.findById(recipeId).exec()

export const findRecipeByIdWithViews = (recipeId: string) =>
    Recipe.findOneAndUpdate(
        { _id: recipeId },
        { $inc: { views: 1 } },
        { returnDocument: 'after', select: '-__v' }
    )
        .populate('author', 'username')
        .exec()

export const saveRecipe = (data: Record<string, unknown>) =>
    new Recipe(data as any).save().then(recipe => recipe._id.toString())

export const updateRecipeDoc = async (recipeId: string, update: Record<string, unknown>) => {
    await Recipe.findByIdAndUpdate(recipeId, update, { returnDocument: 'before' }).exec()
}

export const deleteRecipeDoc = async (recipeId: string) => {
    await Recipe.findByIdAndDelete(recipeId).exec()
}

export const findMyRecipes = (userId: string) =>
    Recipe.find({ author: userId })
        .select('_id title images author date published')
        .select('-__v')
        .populate('author', 'username')
        .lean()
        .sort('-date')
        .exec()

export const findPublishedRecipes = (userId: string) =>
    Recipe.find({
        author: { $ne: userId },
        published: true
    })
        .select('_id title images author date published')
        .select('-__v')
        .populate('author', 'username')
        .lean()
        .sort('-date')
        .exec()

export const findFavoritesRecipes = (userId: string, favoriteIds: string[]) =>
    Recipe.find({
        _id: { $in: favoriteIds },
        $or: [
            { published: true },
            { author: userId }
        ]
    })
        .select('_id title images author date published')
        .select('-__v')
        .populate('author', 'username')
        .lean()
        .sort('-date')
        .exec()

export const cleanUserFavorites = async (recipeId: string) => {
    await User.updateMany({}, { $pull: { favorites: recipeId } }).exec()
}

export const cleanRecipeLikedBy = async (recipeId: string) => {
    await Recipe.updateMany({}, { $pull: { likedBy: recipeId } }).exec()
}

export const findAndToggleRecipe = (userId: string, recipeId: string) => {
    return Recipe.findById(recipeId).exec()
        .then(recipe => {
            if (!recipe) return null
            if (recipe.author.toString() !== userId) {
                throw new Error('not owner')
            }
            recipe.published = !recipe.published
            return recipe.save()
        })
        .then(recipe => {
            if (!recipe) return null
            return { published: recipe.published }
        })
}

// --- Ingredient operations ---

export const addIngredientToRecipe = (recipeId: string, ingredient: { name: string; quantity: string; unit: string; annotation: string; main: boolean }) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) throw new Error('recipe not found')
            doc.ingredients.push(ingredient)
            return doc.save()
        })
        .then(doc => {
            return doc.ingredients[doc.ingredients.length - 1]._id.toString()
        })
}

export const removeIngredientFromRecipe = (recipeId: string, ingredientId: string) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            const { ingredients } = doc
            const index = ingredients.findIndex((ing: any) => ing._id.toString() === ingredientId)
            if (index < 0) throw new Error('ingredient not found')
            ingredients.splice(index, 1)
            return doc.save()
        })
        .then(() => {})
}

// --- Step operations ---

export const addStepToRecipe = (recipeId: string, text: string, note: string, image: string) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) throw new Error('recipe not found')
            const newOrder = doc.steps.length
            const step = { text, note, image, order: newOrder }
            doc.steps.push(step)
            return doc.save()
        })
        .then(doc => {
            return doc.steps[doc.steps.length - 1]._id.toString()
        })
}

export const removeStepFromRecipe = (recipeId: string, stepId: string) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            const { steps } = doc
            const index = steps.findIndex((step: StepDocument) => step._id.toString() === stepId)
            if (index < 0) throw new Error('step not found')
            steps.splice(index, 1)
            steps.forEach((step: StepDocument, newIndex: number) => {
                step.order = newIndex
            })
            return doc.save()
        })
        .then(() => {})
}

export const updateStepInRecipe = (recipeId: string, stepId: string, text: string, note: string, image: string) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            const stepToUpdate = doc.steps.find((step: StepDocument) => step._id.toString() === stepId)
            if (!stepToUpdate) throw new Error('step not found')
            stepToUpdate.text = text
            stepToUpdate.note = note
            stepToUpdate.image = image
            return doc.save()
        })
        .then(() => {})
}

export const reorderStepInRecipe = (recipeId: string, stepId: string, direction: string) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            const stepIndex = doc.steps.findIndex((step: StepDocument) => step._id.toString() === stepId)
            if (stepIndex === -1) throw new Error('Step not found')

            if (direction === 'up' && stepIndex > 0) {
                [doc.steps[stepIndex].order, doc.steps[stepIndex - 1].order] =
                    [doc.steps[stepIndex - 1].order, doc.steps[stepIndex].order]
            } else if (direction === 'down' && stepIndex < doc.steps.length - 1) {
                [doc.steps[stepIndex].order, doc.steps[stepIndex + 1].order] =
                    [doc.steps[stepIndex + 1].order, doc.steps[stepIndex].order]
            }

            doc.steps.sort((a: StepDocument, b: StepDocument) => (a.order ?? 0) - (b.order ?? 0))
            return doc.save()
        })
        .then(() => {})
}

// --- Image operations ---

export const addImageToRecipe = (recipeId: string, image: string) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            if (doc.images.length >= 2) throw new Error('too many images')
            doc.images.push(image)
            return doc.save()
        })
        .then(() => {})
}

export const removeImageFromRecipe = (recipeId: string, index: number) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            if (index >= doc.images.length) throw new Error('image not found')
            doc.images.splice(index, 1)
            return doc.save()
        })
        .then(() => {})
}

// --- Tag operations ---

export const addTagToRecipe = (recipeId: string, tag: string) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            if (doc.tags.length >= 15) throw new Error('too many tags')
            doc.tags.push(tag)
            return doc.save()
        })
        .then(() => {})
}

export const removeTagFromRecipe = (recipeId: string, index: number) => {
    return Recipe.findById(recipeId).exec()
        .then(doc => {
            if (!doc) return null
            if (index >= doc.tags.length) throw new Error('tag not found')
            doc.tags.splice(index, 1)
            return doc.save()
        })
        .then(() => {})
}

// --- Check recipe existence ---

export const recipeExists = async (recipeId: string): Promise<boolean> =>
    (await Recipe.exists({ _id: recipeId })) !== null
