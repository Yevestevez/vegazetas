import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import logic from '../../logic'

import Menu from './Menu'
import MyRecipes from './MyRecipes'
import Recipe from './common/Recipe'
import CreateRecipe from './CreateRecipe'

function Home({ onUserLoggedOut }) {
    const navigate = useNavigate()
    const location = useLocation()

    let viewInPath = location.pathname.slice(1)

    if (viewInPath !== 'my-recipes' && !viewInPath.startsWith('create-recipe') && !viewInPath.startsWith('recipe'))
        viewInPath = 'menu'

    const [view, setView] = useState(viewInPath) // useState(viewInPath)???
    const [selectedRecipeId, setSelectedRecipeId] = useState(null)

    const handleMyRecipesLinkClick = () => setView('my-recipes')

    // const handleCreateRecipeClick = () => {
    //     const userId = logic.getUserId()

    //     if (!userId) {
    //         alert("User not logged in")
    //         return;
    //     }

    //     logic.createRecipe(
    //         userId, // userId
    //         `Borrador de receta ${Date.now()}`, // title
    //     )
    //         .then(() => logic.getMyRecipes(userId))
    //         .then(recipes => {
    //             if (!recipes.length) throw new Error('Error al obtener la nueva receta')

    //             const recipeDraft = recipes[0]
    //             setSelectedRecipeId(recipeDraft)
    //             setView('create-recipe')
    //         })
    //         .catch(error => {
    //             alert(error.message)
    //             console.error(error)
    //         })
    // }

    const handleRecipeThumbnailClick = (recipeId) => {
        setSelectedRecipeId(recipeId)
        setView('recipe')
    }

    const handleLogoLinkClick = () => setView('menu')

    const handleUserLoggedOut = () => onUserLoggedOut()

    useEffect(() => {
        switch (view) {
            case 'menu':
                navigate('/menu')
                break
            case 'my-recipes':
                navigate('/my-recipes')
                break
            case 'create-recipe':
                if (selectedRecipeId) navigate(`/create-recipe/${selectedRecipeId}`)
                break
            case 'recipe':
                if (selectedRecipeId) navigate(`/recipe/${selectedRecipeId}`)
                break
        }
    }, [view, selectedRecipeId, location.pathname, navigate])

    console.log('Home -> render')

    return <main>
        <Routes>
            <Route
                path="/menu"
                element={<Menu
                    onMyRecipesClicked={handleMyRecipesLinkClick}
                    onUserLoggedOut={handleUserLoggedOut}
                // onCreateRecipeClicked={handleCreateRecipeClick}
                />}
            />

            <Route
                path="/my-recipes"
                element={<MyRecipes
                    onRecipeThumbnailClick={handleRecipeThumbnailClick}
                    onUserLoggedOut={handleUserLoggedOut}
                    onLogoClicked={handleLogoLinkClick}
                />}
            />

            <Route
                path="/recipe/:id"
                element={<Recipe
                    recipeId={selectedRecipeId}
                    onUserLoggedOut={handleUserLoggedOut}
                    onLogoClicked={handleLogoLinkClick}
                />}
            />

            <Route
                path="/create-recipe/:id"
                element={<CreateRecipe
                    recipeDraft={selectedRecipeId}
                />}
            />
        </Routes>
    </main>
}

export default Home