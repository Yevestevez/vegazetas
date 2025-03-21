// import formatDate from '../helper/formatDate'
// import { useAppContext } from '../../context'

function RecipeThumbnail({ recipe, onRecipeThumbnailClick }) {
    // const { alert, confirm } = useAppContext()

    const handleRecipeThumbnailClick = event => {
        event.preventDefault()

        onRecipeThumbnailClick()
    }

    console.log('RecipeThumbnail -> render');

    return <article>
        <button type="button" onClick={handleRecipeThumbnailClick}>
            <img className="flex h-50 w-50 object-cover justify-center" src={recipe.images[0]} />
            <h3>{recipe.title}</h3>
            <div>{recipe.date}</div>
        </button>

        <div>
            <button type="button" onClick={() => alert('Compartir')}>compartir</button>
            <button type="button" onClick={() => alert('Me gusta')}>Me gusta</button>
            <button type="button" onClick={() => alert('Añadir a lista')}>Añadir a la lista</button>
        </div>
    </article >
}

export default RecipeThumbnail