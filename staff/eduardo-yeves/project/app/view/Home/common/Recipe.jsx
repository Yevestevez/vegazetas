// import { useState } from 'react'

// import logic from '../../../logic'

// import formatDate from '../helper/formatDate'

// import { useAppContext } from '../../context'
import Header from '../common/Header'

function Recipe({ recipe, onUserLoggedOut, onLogoClicked }) {
    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleLogoLinkCLick = () => onLogoClicked()
    console.log('Recipe -> render');

    return <article className='pt-25'>
        <Header
            onUserLoggedOut={handleUserLoggedOut}
            onLogoClicked={handleLogoLinkCLick}
        />
        <h3>Hi, Recipe!</h3>

        <h3>{recipe.title}</h3>

    </article >
}

export default Recipe