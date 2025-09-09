import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import logic from '../../logic'

import NotFoundError from 'com/errors/NotFoundError'

import Menu from './Menu'
import MyRecipes from './MyRecipes'
import Recipe from './common/Recipe'
import SaveRecipe from './SaveRecipe'

import { useAppContext } from '../../context'

function Home({ onUserLoggedOut }) {
    const { alert } = useAppContext()

    const navigate = useNavigate()
    const location = useLocation()

    let viewInPath = location.pathname.slice(1)

    if (viewInPath !== 'my-recipes' && !viewInPath.startsWith('create-recipe') && !viewInPath.startsWith('update-recipe') && !viewInPath.startsWith('recipe'))
        viewInPath = 'menu'

    const [view, setView] = useState(viewInPath)
    const [selectedRecipeId, setSelectedRecipeId] = useState(null)

    const handleMyRecipesLinkClick = () => setView('my-recipes')

    const handleCreateRecipeClick = () => {
        Promise.resolve(logic.getUserId())
            .then(userId => {
                if (!userId) throw new NotFoundError('user not found')
                return logic.createRecipe(userId, `Borrador de receta ${String(new Date().getDate()).padStart(2,"0")}/${String(new Date().getMonth()+1).padStart(2,"0")} ${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}:${String(new Date().getSeconds()).padStart(2,"0")}`)
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
        setView('update-recipe')
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

    const handleRecipeDeleted = () => setView('my-recipes')

    const handleRecipeBackButton = () => setView("my-recipes")

    const handleSaveRecipeBackButton = () => setView("my-recipes")

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
            case 'update-recipe':
                if (selectedRecipeId) {
                    navigate(`/update-recipe/${selectedRecipeId}`)
                }
                break
            case 'recipe':
                if (selectedRecipeId) navigate(`/recipe/${selectedRecipeId}`)
                break
        }
    }, [view, selectedRecipeId, location.pathname, navigate])

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
                    onCreateRecipeClicked={handleCreateRecipeClick}
                />}
            />

            <Route
                path="/recipe/:id"
                element={<Recipe
                    onUserLoggedOut={handleUserLoggedOut}
                    onLogoClicked={handleLogoLinkClick}
                    onEditRecipeClicked={handleRecipeEditClick}
                    onRecipeDeleted={handleRecipeDeleted}
                    onRecipeBackButtonClicked={handleRecipeBackButton}
                />}
            />

            <Route
                path="/create-recipe/:id"
                element={<SaveRecipe
                    view="create"
                    onToRecipeClicked={handleToRecipeClick}
                    onRecipeDeleted={handleRecipeDeleted}
                    onUserLoggedOut={handleUserLoggedOut}
                    onLogoClicked={handleLogoLinkClick}
                    onSaveRecipeBackButtonClicked={handleSaveRecipeBackButton}
                />}
            />

            <Route
                path="/update-recipe/:id"
                element={<SaveRecipe
                    view="update"
                    onToRecipeClicked={handleToRecipeClick}
                    onRecipeDeleted={handleRecipeDeleted}
                    onUserLoggedOut={handleUserLoggedOut}
                    onLogoClicked={handleLogoLinkClick}
                    onSaveRecipeBackButtonClicked={handleSaveRecipeBackButton}
                />}
            />
        </Routes>
    </main>
}

export default Home