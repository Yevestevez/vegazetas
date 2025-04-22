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
        rounded-full 

        /* Tamaño */
        h-[20vw] w-[20vw]
        sm:w-[18vw] sm:h-[18vw]
        md:w-[14vw] md:h-[14vw]
        lg:h-[11vw] lg:w-[11vw]
        xl:h-[10vw] xl:w-[10vw]
        2xl:h-[8vw] 2xl:w-[8vw]

        /* Sombra */
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

        /* Estilo de texto */
        anybody-logo
        text-[clamp(min(4vw,10rem),4vw,10rem)]/[100%]
        md:text-[clamp(min(2vw,10rem),4vw,10rem)]
        lg:text-[clamp(min(2vw,10rem),3vw,10rem)]
        xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

        /* Hover y animaciones */
        transition-transform duration-150 ease-out
        hover:bg-aquamarine hover:text-folly
        hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
        hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
        hover:-translate-y-2 hover:scale-105
    `

    console.log('MyRecipes -> render')

    return <div className="flex flex-col items-center text-center bg-canary h-screen w-screen pt-25">
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />

        <h1 className="py-3 anybody-logo text-folly text-[6vw] drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)]">Tus recetas</h1>

        <main className="w-full">
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
                    <p className="text-center anybody font-bold text-folly">No tienes recetas aún. ¡Añade una nueva!</p>
                    <button type='button' className={`${btnClasses}flex items-center mx-auto justify-center text-center bg-folly mt-[8vw] text-spring-bud`} onClick={handleCreateRecipeClick}>Nueva<br></br>receta</button>
                </>
            )}
        </main>
    </div>
}

export default MyRecipes