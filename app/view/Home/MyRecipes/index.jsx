import { useState, useEffect } from 'react'

import logic from '../../../logic'
import RecipeThumbnail from '../common/RecipeThumbnail'
import Header from '../common/Header'

import { useAppContext } from '../../../context'

function MyRecipes({ onRecipeThumbnailClick, onUserLoggedOut, onLogoClicked, onCreateRecipeClicked }) {
    const { alert } = useAppContext()

    const [myRecipes, setMyRecipes] = useState([])

    useEffect(() => {
        console.log('MyRecipes -> useEffect')

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

    const handleLogoLinkClick = () => onLogoClicked()

    const handleCreateRecipeClick = event => {
        event.preventDefault()

        onCreateRecipeClicked()
    }

    console.log('MyRecipes -> render')

    return <div className="flex flex-col xl:flex-row min-h-screen w-full items-center text-center overflow-x-hidden pt-[21vw] sm:pt-[17vw] md:pt-[16vw] xl:pt-[0vw] bg-canary">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkClick}
        />

        <div className="flex xl:fixed xl:bottom-0 text-center py-[2vw] xl:py-[5vh] items-center xl:justify-end xl:px-[5vw] xl:w-[40vw] xl:h-[60vh] xl:bg-sgbus-green">
            <h1 className="anybody-logo text-folly xl:text-veronica text-[6vw] xl:text-[2.6vw]/[100%] drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)]">Tus <br className="hidden xl:block" />recetas</h1>
        </div>

        <main className="flex flex-col w-full xl:w-[35vw] xl:ml-[40vw]">
            {myRecipes.length > 0 ? (
                myRecipes.map(recipe => (
                    <RecipeThumbnail
                        key={recipe.id}
                        recipe={recipe}
                        onRecipeDeleted={handleRecipeDeleted}
                        onRecipeUpdated={handleRecipeUpdated}
                        onRecipeThumbnailClick={handleRecipeThumbnailClick}
                    />
                ))
            ) : (
                <>
                    <p className="text-center mt-[2vw] anybody font-bold text-folly text-[4vw]/[120%] xl:text-[2vw]/[120%]">Todavía no tienes ninguna receta<br />¡Añade una nueva!</p>
                    <button
                        type='button'
                        onClick={handleCreateRecipeClick}
                        className="
                            flex items-center justify-center rounded-full mx-auto text-center
                            h-[20vw] sm:h-[18vw] md:h-[14vw] xl:h-[10vw]
                            w-[20vw] sm:w-[18vw] md:w-[14vw] xl:w-[10vw]

                            anybody-logo text-[clamp(1rem,4vw,10rem)]/[100%] md:text-[clamp(1.5rem,3vw,10rem)] xl:text-[clamp(1rem,2vw,3rem)]

                            drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                            hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)] hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)]

                            bg-folly mt-[8vw] text-spring-bud hover:bg-aquamarine hover:text-folly
                            hover:-translate-y-2 hover:scale-105 transition-transform duration-150 ease-out
                        ">Nueva<br></br>receta</button>
                </>
            )}
        </main>
    </div>
}

export default MyRecipes