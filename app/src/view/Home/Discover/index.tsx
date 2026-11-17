import { useState, useEffect, useCallback } from 'react'

import logic from '../../../logic'
import { useAppContext } from '../../../context'
import handleCredentialsError from '../../helper/handleCredentialsError'
import type { RecipeListItemWithAuthor } from '../../../types/recipe'

import Header from '../common/Header'
import RecipeThumbnail from '../common/RecipeThumbnail'
import Footer from '../../common/Footer'

interface DiscoverProps {
    onRecipeThumbnailClick: (recipeId: string) => void
    onUserLoggedOut: () => void
}

function Discover({ onRecipeThumbnailClick, onUserLoggedOut }: DiscoverProps) {
    const { alert } = useAppContext()

    const [publishedRecipes, setPublishedRecipes] = useState<RecipeListItemWithAuthor[]>([])

    const loadPublishedRecipes = useCallback((isActive: () => boolean = () => true) => {
        try {
            logic.getPublishedRecipes()
                .then((recipes: RecipeListItemWithAuthor[]) => { if (isActive()) setPublishedRecipes(recipes) })
                .catch(error => {
                    if (!isActive() || handleCredentialsError(error, alert, onUserLoggedOut)) return
                    alert(error.message)

                    console.error(error)
                })
        } catch (error) {
            if (!isActive() || handleCredentialsError(error, alert, onUserLoggedOut)) return
            alert((error as Error).message)

            console.error(error)
        }
    }, [alert, onUserLoggedOut])

    useEffect(() => {
        let active = true
        loadPublishedRecipes(() => active)
        return () => { active = false }
    }, [loadPublishedRecipes])

    const handleToggleFavorite = (recipeId: string) => {
        const recipe = publishedRecipes.find(r => r.id === recipeId)

        if (!recipe) {
            logic.toggleFavoriteRecipe(recipeId)
                .then(() => loadPublishedRecipes())
                .catch(error => {
                    console.error(error)
                    alert((error as Error).message)
                })

            return
        }

        const prevIsFavorite = recipe.isFavorite

        setPublishedRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r))

        logic.toggleFavoriteRecipe(recipeId)
            .catch(error => {
                setPublishedRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, isFavorite: prevIsFavorite } : r))
                console.error(error)
                alert((error as Error).message)
            })

        alert(prevIsFavorite ? 'Receta eliminada de favoritos' : 'Receta añadida a favoritos')
    }

    const handleRecipeDeleted = () => loadPublishedRecipes()
    const handleRecipeUpdated = () => loadPublishedRecipes()
    const handleRecipeThumbnailClick = (recipeId: string) => onRecipeThumbnailClick(recipeId)
    const handleUserLoggedOut = () => onUserLoggedOut()

    return <div className="flex flex-col min-h-screen w-full items-center text-center bg-hot-magenta">
        <Header
            variant="discover"
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="
        flex flex-col w-full max-w-6xl overflow-hidden
        pt-20 xs:pt-24
        pb-24 xs:pb-28 sm:pb-32
        gap-2
        ">
            <h1 className="anybody-logo text-aquamarine text-lg xs:text-xl sm:text-2xl xl:text-3xl drop-shadow-hard-sm pb-2">Descubre</h1>

            {publishedRecipes.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4
                px-8 xs:px-10 md:px-12 xl:px-14 2xl:px-16
                gap-8 xs:gap-10 lg:gap-12 xl:gap-14 2xl:gap-10">
                    {publishedRecipes.map(recipe => (
                        <RecipeThumbnail
                            key={recipe.id}
                            recipe={recipe}
                            variant={'discover'}
                            onRecipeDeleted={handleRecipeDeleted}
                            onRecipeUpdated={handleRecipeUpdated}
                            onRecipeThumbnailClick={handleRecipeThumbnailClick}
                            onToggleFavoriteClick={() => handleToggleFavorite(recipe.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 xs:gap-6">
                    <p className="text-center anybody font-bold text-veronica text-sm xl:text-base leading-tight xl:leading-tight">Todavía no hay recetas publicadas<br></br>de otros usuarios</p>
                </div>
            )
            }
        </main >

        <Footer />
    </div >
}

export default Discover
