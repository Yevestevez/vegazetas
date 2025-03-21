// import { useState } from 'react'

// import logic from '../../../logic'

// import formatDate from '../helper/formatDate'

// import { useAppContext } from '../../context'

import { useParams } from "react-router-dom"

function Recipe({ recipes }) {

    console.log('Recipe -> render');

    return <article>

        <h3>Hi, Recipe!</h3>

        <h3>{recipe.title}</h3>

    </article >
}

export default Recipe