import { useState, useEffect } from 'react'

import logic from '../../../logic'
import { useAppContext } from '../../../context'

import Header from '../common/Header'
import RecipeThumbnail from '../common/RecipeThumbnail'
import CircleButton from '../../common/CircleButton'
import Footer from '../../common/Footer'

function MyRecipes({ onRecipeThumbnailClick, onUserLoggedOut, onCreateRecipeClicked }) {
    const { alert } = useAppContext()

    const [myRecipes, setMyRecipes] = useState([])

    useEffect(() => {
        loadMyRecipes()
    }, [])

    const loadMyRecipes = () => {
        try {
            logic.getMyRecipes()
                .then(myRecipes => setMyRecipes(myRecipes))
                .catch(error => {
                    alert(error.message)

                    console.error(error)
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    const handleRecipeDeleted = () => loadMyRecipes()
    const handleRecipeUpdated = () => loadMyRecipes()
    const handleRecipeThumbnailClick = (recipeId) => onRecipeThumbnailClick(recipeId)
    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleCreateRecipeClick = event => {
        event.preventDefault()

        onCreateRecipeClicked()
    }

    return <div className="flex flex-col min-h-screen w-full items-center text-center bg-sgbus-green">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
        />

        <main className="flex flex-col w-full py-20 xs:py-24 lg:py-32 xl:py-36 gap-2 max-w-7xl overflow-hidden">
            <h1 className="anybody-logo text-veronica text-lg xs:text-xl sm:text-2xl xl:text-3xl drop-shadow-[0.14em_0.14em_0_rgba(0,0,0,0.8)] pb-2">Tus recetas</h1>
            {myRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xs:gap-10 w-full">
                    {myRecipes.map(recipe => (
                        <RecipeThumbnail
                            key={recipe.id}
                            recipe={recipe}
                            onRecipeDeleted={handleRecipeDeleted}
                            onRecipeUpdated={handleRecipeUpdated}
                            onRecipeThumbnailClick={handleRecipeThumbnailClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 xs:gap-6">
                    <p className="text-center anybody font-bold text-veronica text-sm xl:text-base leading-tight xl:leading-tight">Todavía no tienes ninguna receta<br />¡Añade una nueva!</p>

                    <CircleButton onClick={handleCreateRecipeClick} variant="small" className="bg-veronica text-sgbus-green outline-none hover:outline hover:outline-4 hover:outline-offset-0 hover:text-veronica hover:outline-veronica hover:bg-sgbus-green xs:text-lg">Nueva Receta</CircleButton>
                </div>
            )
            }
        </main >
        <Footer />
    </div >
}

export default MyRecipes