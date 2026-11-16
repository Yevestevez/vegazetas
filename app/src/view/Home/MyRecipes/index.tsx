import { useState, useEffect, useCallback } from 'react'

import logic from '../../../logic'
import { useAppContext } from '../../../context'
import handleCredentialsError from '../../helper/handleCredentialsError'
import type { RecipeListItem } from '../../../types/recipe'

import Header from '../common/Header'
import MyRecipeThumbnail from '../common/MyRecipeThumbnail'
import CircleButton from '../../common/CircleButton'
import Footer from '../../common/Footer'

interface MyRecipesProps {
    onRecipeThumbnailClick: (recipeId: string) => void
    onUserLoggedOut: () => void
    onCreateRecipeClicked: () => void
}

function MyRecipes({ onRecipeThumbnailClick, onUserLoggedOut, onCreateRecipeClicked }: MyRecipesProps) {
    const { alert } = useAppContext()

    const [myRecipes, setMyRecipes] = useState<RecipeListItem[]>([])

    const loadMyRecipes = useCallback((isActive: () => boolean = () => true) => {
        try {
            logic.getMyRecipes()
                .then((recipes: RecipeListItem[]) => { if (isActive()) setMyRecipes(recipes) })
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
        loadMyRecipes(() => active)
        return () => { active = false }
    }, [loadMyRecipes])

    const handleRecipeDeleted = () => loadMyRecipes()
    const handleRecipeUpdated = () => loadMyRecipes()
    const handleRecipeThumbnailClick = (recipeId: string) => onRecipeThumbnailClick(recipeId)
    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleCreateRecipeClick = () => {
        onCreateRecipeClicked()
    }

    const handleToggleFavorite = (recipeId: string) => {
        const recipe = myRecipes.find(r => r.id === recipeId)

        if (!recipe) {
            logic.toggleFavoriteRecipe(recipeId)
                .then(() => loadMyRecipes())
                .catch(error => {
                    console.error(error)
                    alert((error as Error).message)
                })

            return
        }

        const prevIsFavorite = recipe.isFavorite

        setMyRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r))

        logic.toggleFavoriteRecipe(recipeId)
            .catch(error => {
                setMyRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, isFavorite: prevIsFavorite } : r))
                console.error(error)
                alert((error as Error).message)
            })

        alert(prevIsFavorite ? 'Receta eliminada de favoritos' : 'Receta añadida a favoritos')
    }


    return <div className="flex flex-col min-h-screen w-full items-center text-center bg-sgbus-green">
        <Header
            variant="myRecipes"
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="
            flex flex-col w-full max-w-9xl overflow-hidden
            pt-20 xs:pt-24 lg:pt-36 xl:pt-40
            pb-24 xs:pb-28 sm:pb-32
            gap-2
        ">
            <h1 className="anybody-logo text-veronica text-lg xs:text-xl sm:text-2xl xl:text-3xl drop-shadow-hard-sm pb-2">Tus recetas</h1>
            {myRecipes.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4
                px-8 xs:px-10 md:px-12 xl:px-14 2xl:px-16
                gap-8 xs:gap-10 lg:gap-12 xl:gap-14">
                    {myRecipes.map(recipe => (
                        <MyRecipeThumbnail
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
                    <p className="text-center anybody font-bold text-veronica text-sm xl:text-base leading-tight xl:leading-tight">Todavía no tienes ninguna receta<br />¡Añade una nueva!</p>

                    <CircleButton onClick={() => handleCreateRecipeClick()} variant="small" className="bg-veronica text-sgbus-green outline-none hover:outline hover:outline-4 hover:outline-offset-0 hover:text-veronica hover:outline-veronica hover:bg-sgbus-green xs:text-lg">Nueva Receta</CircleButton>
                </div>
            )
            }
        </main >
        <Footer />
    </div >
}

export default MyRecipes
