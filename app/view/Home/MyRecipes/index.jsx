import { useState, useEffect } from 'react'

import logic from '../../../logic'
import RecipeThumbnail from '../common/RecipeThumbnail'
import Header from '../common/Header'

import { useAppContext } from '../../../context'

function MyRecipes({ onRecipeThumbnailClick, onUserLoggedOut, onLogoClicked, onCreateRecipeClicked }) {
    const { alert } = useAppContext()

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

    const handleCreateRecipeClick = event => {
        event.preventDefault()

        onCreateRecipeClicked()
    }

    const btnClasses = `
        /* Layout */
        flex items-center justify-center rounded-full

        /* Tamaño */
        h-[20vw] w-[20vw]
        sm:w-[18vw] sm:h-[18vw]
        md:w-[14vw] md:h-[14vw]

        /* Tipografía */
        anybody-logo
        text-[clamp(min(4vw,10rem),4vw,10rem)]/[100%]
        md:text-[clamp(min(2vw,10rem),3vw,10rem)]

        /* Sombra */
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
        md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]

        /* Animaciones */
        transition-transform duration-150 ease-out

        /* Hover */
        hover:bg-aquamarine hover:text-folly
        hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)]
        hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)]
        hover:-translate-y-2 hover:scale-105
    `

    console.log('MyRecipes -> render')

    return <div className="
        /* Layout */
        flex flex-col xl:flex-row min-h-screen w-full items-center text-center overflow-x-hidden

        pt-[21vw] sm:pt-[17vw] md:pt-[16vw] xl:pt-[0vw]

        /* Colores */
        bg-canary
    ">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <div className="
            flex xl:fixed xl:top-[60vh] text-center py-[2vw] xl:py-[5vh] items-center justify-center

            xl:min-w-[30vw]
            xl:min-h-[40vh]

            xl:bg-sgbus-green
        ">
            <h1 className="
                /* Tipografía */
                anybody-logo text-folly xl:text-veronica text-[6vw] xl:text-[5vw]/[100%]

                /* Sombra */
                drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)]
            ">Tus <br className="hidden xl:block" />recetas</h1>
        </div>

        <main className="flex flex-col w-full xl:w-[70vw] xl:ml-[30vw]">
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
                    <p className="
                        /* Layout */
                        text-center mt-[2vw]

                        /* Tipografía */
                        anybody font-bold text-folly text-[4vw]/[120%]
                    ">Todavía no tienes ninguna receta<br />¡Añade una nueva!</p>
                    <button type='button' className={`
                        ${btnClasses}
                        /* Layout */
                        flex items-center mx-auto justify-center text-center

                        /* Colores */
                        bg-folly mt-[8vw] text-spring-bud
                    `} onClick={handleCreateRecipeClick}>Nueva<br></br>receta</button>
                </>
            )}
        </main>
    </div>
}

export default MyRecipes