import { useState, useEffect } from 'react'

import logic from '../../../logic'
import { useAppContext } from '../../../context'

import Header from '../common/Header'
import RecipeThumbnail from '../common/RecipeThumbnail'
import Footer from '../../common/Footer'

function Discover({ onRecipeThumbnailClick, onUserLoggedOut }) {
    const { alert } = useAppContext()

    const [publishedRecipes, setPublishedRecipes] = useState([])

    useEffect(() => {
        loadPublishedRecipes()
    }, [])

    const loadPublishedRecipes = () => {
        try {
            logic.getPublishedRecipes()
                .then(publishedRecipes => setPublishedRecipes(publishedRecipes))
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
        logic.toggleFavoriteRecipe(recipeId)
            .then(() => loadPublishedRecipes()) // asegura estado real
            .catch(console.error)
    }

    const handleRecipeDeleted = () => loadPublishedRecipes()
    const handleRecipeUpdated = () => loadPublishedRecipes()
    const handleRecipeThumbnailClick = (recipeId) => onRecipeThumbnailClick(recipeId)
    const handleUserLoggedOut = () => onUserLoggedOut()

    return <div className="flex flex-col min-h-screen w-full items-center text-center bg-hot-magenta">
        <Header
            variant="discover"
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="
        flex flex-col w-full max-w-7xl overflow-hidden
        pt-20 xs:pt-24 lg:pt-36 xl:pt-40
        pb-24 xs:pb-28 sm:pb-32
        gap-2
        ">
            <h1 className="anybody-logo text-aquamarine text-lg xs:text-xl sm:text-2xl xl:text-3xl drop-shadow-[0.14em_0.14em_0_rgba(0,0,0,0.8)] pb-2">Descubre</h1>

            {publishedRecipes.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                px-8 xs:px-10 md:px-12 xl:px-14
                gap-8 xs:gap-10 lg:gap-12 xl:gap-14">
                    {publishedRecipes.map(recipe => (
                        <RecipeThumbnail
                            key={recipe.id}
                            recipe={recipe}
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