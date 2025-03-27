import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import logic from '../../logic'

import NotFoundError from 'com/errors/NotFoundError'

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

    const [view, setView] = useState(viewInPath)
    const [selectedRecipeId, setSelectedRecipeId] = useState(null)

    const handleMyRecipesLinkClick = () => setView('my-recipes')

    const handleCreateRecipeClick = () => {
        Promise.resolve(logic.getUserId())
            .then(userId => {
                if (!userId) throw new NotFoundError('user not found')
                return logic.createRecipe(userId, `Borrador de receta ${Date.now()}`)
            })
            .then(recipeId => {
                if (!recipeId) throw new NotFoundError('recipe not found')

                setSelectedRecipeId(recipeId)
                setView('create-recipe')
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleRecipeEditClick = (recipeId) => {
        setSelectedRecipeId(recipeId)
        setView('create-recipe')
    }

    const handleRecipeThumbnailClick = (recipeId) => {
        setSelectedRecipeId(recipeId)
        setView('recipe')
    }

    const handleToRecipeClick = (recipeId) => {
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
                if (selectedRecipeId) {
                    navigate(`/create-recipe/${selectedRecipeId}`)
                }
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
                    onUserLoggedOut={handleUserLoggedOut}
                    onLogoClicked={handleLogoLinkClick}
                    onEditRecipeClicked={handleRecipeEditClick}
                />}
            />

            <Route
                path="/create-recipe/:id"
                element={<CreateRecipe
                    view="create"
                    onToRecipeClicked={handleToRecipeClick}
                />}
            />

            <Route
                path="/update-recipe/:id"
                element={<CreateRecipe
                    view="update"
                />}
            />
        </Routes>
    </main>
}

export default Home