import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'

import logic from '../../logic'
import { useAppContext } from '../../context'

import NotFoundError from 'com/errors/NotFoundError'

import Menu from './Menu'
import MyRecipes from './MyRecipes'
import Recipe from './common/Recipe'
import SaveRecipe from './SaveRecipe'
import Discover from './Discover'
import Favorites from './Favorites'

function Home({ onUserLoggedOut }) {
    const { alert } = useAppContext()

    const navigate = useNavigate()

    const handleMyRecipesLinkClick = () => navigate('/my-recipes')

    const handleCreateRecipeClick = () => {
        Promise.resolve(logic.getUserId())
            .then(userId => {
                if (!userId) throw new NotFoundError('user not found')

                return logic.createRecipe(userId, `Borrador de receta ${String(new Date().getDate()).padStart(2, "0")}/${String(new Date().getMonth() + 1).padStart(2, "0")} ${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}:${String(new Date().getSeconds()).padStart(2, "0")}`)
            })
            .then(recipeId => {
                if (!recipeId) throw new NotFoundError('recipe not found')

                navigate(`/create-recipe/${recipeId}`)
            })
            .catch(error => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleRecipeEditClick = (recipeId) => { navigate(`/update-recipe/${recipeId}`) }

    const handleRecipeThumbnailClick = (recipeId) => { navigate(`/recipe/${recipeId}`) }

    const handleToRecipeClick = (recipeId) => { navigate(`/recipe/${recipeId}`) }

    const handleLogoLinkClick = () => navigate('/menu')

    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleRecipeDeleted = () => navigate('/my-recipes')

    const handleRecipeBackButton = () => navigate('/my-recipes')

    const handleSaveRecipeBackButton = () => navigate('/my-recipes')

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
                    onCreateRecipeClicked={handleCreateRecipeClick}
                />}
            />

            <Route
                path="/discover"
                element={<Discover
                    onRecipeThumbnailClick={handleRecipeThumbnailClick}
                    onUserLoggedOut={handleUserLoggedOut}
                />}
            />

            <Route
                path="/favorites"
                element={<Favorites
                    onRecipeThumbnailClick={handleRecipeThumbnailClick}
                    onUserLoggedOut={handleUserLoggedOut}
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