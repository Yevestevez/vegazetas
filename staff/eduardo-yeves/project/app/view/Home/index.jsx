import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Menu from './Menu'
import MyRecipes from './MyRecipes'
import Recipe from './common/Recipe'
import CreateRecipe from './CreateRecipe'

function Home({ onUserLoggedOut }) {
    const navigate = useNavigate()
    const location = useLocation()

    let viewInPath = location.pathname.slice(1)

    if (viewInPath !== 'my-recipes' && viewInPath !== 'create-recipe' && !viewInPath.startsWith('recipe'))
        viewInPath = 'menu'

    const [view, setView] = useState('menu') // useState(viewInPath)???
    const [selectedRecipe, setSelectedRecipe] = useState(null)

    const handleMyRecipesLinkClick = () => setView('my-recipes')
    const handleCreateRecipeClick = () => setView('create-recipe')
    const handleRecipeThumbnailClick = (recipe) => {
        setSelectedRecipe(recipe)
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
                navigate('/create-recipe')
                break
            case 'recipe':
                if (selectedRecipe) navigate(`/recipe/${selectedRecipe.id}`)
                break
        }
    }, [view, selectedRecipe, location.pathname, navigate])

    console.log('Home -> render')

    return <main>
        <Routes>
            <Route
                path="/menu"
                element={<Menu
                    onMyRecipesClicked={handleMyRecipesLinkClick}
                    onUserLoggedOut={handleUserLoggedOut}
                    onCreateRecipeClicked={handleCreateRecipeClick}
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
                    recipe={selectedRecipe}
                    onUserLoggedOut={handleUserLoggedOut}
                    onLogoClicked={handleLogoLinkClick}
                />}
            />

            <Route
                path="/create-recipe"
                element={<CreateRecipe
                />}
            />
        </Routes>
    </main>
}

export default Home