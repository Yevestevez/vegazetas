import { useState, useEffect } from 'react'

import logic from '../../../logic'
import RecipeThumbnail from '../common/RecipeThumbnail'

// import { useAppContext } from '../../context';

function MyRecipes({ onRecipeThumbnailClick }) {
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
    const handleRecipeThumbnailClick = (recipe) => onRecipeThumbnailClick(recipe)

    console.log('MyRecipes -> render')

    return <>
        <div>
            <h1>Hello, MyRecipes</h1>
        </div>

        <main>
            {myRecipes.map(recipe => (
                <RecipeThumbnail
                    key={recipe.id}
                    recipe={recipe}
                    onRecipeDeleted={handleRecipeDeleted}
                    onRecipeUpdated={handleRecipeUpdated}
                    onRecipeThumbnailClick={() => handleRecipeThumbnailClick(recipe)}
                />))}
        </main>
    </>
}

export default MyRecipes