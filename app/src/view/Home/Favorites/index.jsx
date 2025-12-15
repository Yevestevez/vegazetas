import { useState, useEffect } from 'react'

import logic from '../../../logic'
import { useAppContext } from '../../../context'

import Header from '../common/Header'
import RecipeThumbnail from '../common/RecipeThumbnail'
import Footer from '../../common/Footer'

function Favorites({ onRecipeThumbnailClick, onUserLoggedOut }) {
    const { alert } = useAppContext()

    const [favoritesRecipes, setFavoritesRecipes] = useState([])

    useEffect(() => {
        loadFavoritesRecipes()
    }, [])

    const loadFavoritesRecipes = () => {
        try {
            logic.getFavoritesRecipes()
                .then(favoritesRecipes => setFavoritesRecipes(favoritesRecipes))
                .catch(error => {
                    alert(error.message)

                    console.error(error)
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    const handleToggleFavorite = (recipeId) => {
        const recipe = favoritesRecipes.find(r => r.id === recipeId)

        if (!recipe) {
            logic.toggleFavoriteRecipe(recipeId)
                .then(() => loadFavoritesRecipes())
                .catch(error => {
                    console.error(error)
                    alert(error.message)
                })

            return
        }

        const prevIsFavorite = recipe.isFavorite

        setFavoritesRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r))

        logic.toggleFavoriteRecipe(recipeId)
            .catch(error => {
                setFavoritesRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, isFavorite: prevIsFavorite } : r))
                console.error(error)
                alert(error.message)
            })

        alert(prevIsFavorite ? 'Receta eliminada de favoritos' : 'Receta añadida a favoritos')
    }

    const handleRecipeDeleted = () => loadFavoritesRecipes()
    const handleRecipeUpdated = () => loadFavoritesRecipes()
    const handleRecipeThumbnailClick = (recipeId) => onRecipeThumbnailClick(recipeId)
    const handleUserLoggedOut = () => onUserLoggedOut()

    return <div className="flex flex-col min-h-screen w-full items-center text-center bg-aquamarine">
        <Header
            variant="favorites"
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="
        flex flex-col w-full max-w-7xl overflow-hidden
        pt-20 xs:pt-24 lg:pt-36 xl:pt-40
        pb-24 xs:pb-28 sm:pb-32
        gap-2
        ">
            <h1 className="anybody-logo text-coquelicot text-lg xs:text-xl sm:text-2xl xl:text-3xl drop-shadow-[0.14em_0.14em_0_rgba(0,0,0,0.8)] pb-2">Las Favoritas</h1>

            {favoritesRecipes.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                px-8 xs:px-10 md:px-12 xl:px-14
                gap-8 xs:gap-10 lg:gap-12 xl:gap-14">
                    {favoritesRecipes.map(recipe => (
                        <RecipeThumbnail
                            key={recipe.id}
                            recipe={recipe}
                            variant={'favorites'}
                            onRecipeDeleted={handleRecipeDeleted}
                            onRecipeUpdated={handleRecipeUpdated}
                            onRecipeThumbnailClick={handleRecipeThumbnailClick}
                            onToggleFavoriteClick={() => handleToggleFavorite(recipe.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 xs:gap-6">
                    <p className="text-center anybody font-bold text-veronica text-sm xl:text-base leading-tight xl:leading-tight">Todavía no tienes recetas favoritas</p>
                </div>
            )
            }
        </main >

        <Footer />
    </div >
}

export default Favorites