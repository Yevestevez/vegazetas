import { useState, useEffect } from 'react'

import logic from '../../../logic'
import RecipeThumbnail from '../common/RecipeThumbnail'
import Header from '../common/Header'

// import { useAppContext } from '../../context';

function MyRecipes({ onRecipeThumbnailClick, onUserLoggedOut, onLogoClicked }) {
    // const { alert } = useAppContext();

    const [myRecipes, setMyRecipes] = useState([])

    useEffect(() => {
        console.log('MyRecipes -> "componentDidMount" (useEffect)')

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

    const handleLogoLinkCLick = () => onLogoClicked()

    console.log('MyRecipes -> render')

    return <div className="flex flex-col items-center text-center bg-canary h-full w-screen pt-25">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <h1 className="py-3 anybody-logo text-folly text-[6vw] drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)]">Tus recetas</h1>

        <main className="w-full">
            {myRecipes.map(recipe => (
                <RecipeThumbnail
                    key={recipe.id}
                    recipe={recipe}
                    onRecipeDeleted={handleRecipeDeleted}
                    onRecipeUpdated={handleRecipeUpdated}
                    onRecipeThumbnailClick={handleRecipeThumbnailClick}
                />))}
        </main>
    </div>
}

export default MyRecipes