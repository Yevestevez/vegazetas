// import logic from '../../../logic'
import Header from '../common/Header'

// import { useAppContext } from '../../context'

function CreateRecipe({ recipe }) {
    //const { alert } = useAppContext()


    console.log('CreateRecipe -> render')
    console.log(recipe.title)

    // Estilos comunes (TailwindCSS)
    const inputClasses = `
        /* Flexbox */
        flex items-center justify-center

        /* Tamaño y estructura */
        h-[11vw]
        p-5  mb-3

        /* Fondo, sombra y focus */
        bg-spring-bud rounded-full outline-spring-bud 
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] focus:outline-5 focus:bg-folly focus:text-spring-bud

        /* Texto */
        anybody text-folly text-center text-[4vw]
        min-w-0 truncate
    `

    const inputClassesReverse = `
        /* Flexbox */
        flex items-center justify-center

        /* Tamaño y estructura */
        h-[11vw]
        p-5  mb-3

        /* Fondo, sombra y focus */
        bg-folly rounded-full outline-folly 
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] focus:outline-5 focus:bg-spring-bud focus:text-folly

        /* Texto */
        anybody text-spring-bud text-center text-[4vw]
        min-w-0 truncate
    `

    const labelClasses = `
        text-spring-bud anybody font-bold text-[5vw]
    `

    const labelClassesReverse = `
    text-folly anybody font-bold text-[5vw]
`

    return <section className="flex flex-col items-center text-center bg-folly h-full w-screen pt-25">
        <Header />

        <h1 className="py-5 anybody-logo text-spring-bud text-[6vw] drop-shadow-[0.15em_0.15em_0_rgba(0,0,0,0.8)]">Crea tu nueva receta</h1>

        <form className="flex flex-col gap-2">
            <label className={`${labelClasses}`} htmlFor="name">Nombre</label>
            <input className={`${inputClasses} w-[80vw]`} type="text" id="name" placeholder={recipe.title} />

            <label className={`${labelClasses}`} htmlFor="images">Imágenes</label>
            <input className={`${inputClasses} w-[80vw]`} type="text" id="images" placeholder="Añade imágenes a tu receta" />

            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col gap-2">
                    <label className={`${labelClasses}`} htmlFor="time">Tiempo</label>
                    <input className={`${inputClasses} w-[35vw]`} type="number" id="time" placeholder="En minutos" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className={`${labelClasses}`} htmlFor="difficulty">Dificultad</label>
                    <input className={`${inputClasses} w-[35vw]`} type="text" id="difficulty" placeholder="easy, medium, difficult" />
                </div>
            </div>

            <div className="flex flex-col w-full items-center gap-2 p-5 bg-spring-bud mt-3 drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]">
                <label className={`${labelClassesReverse}`} htmlFor="tags">Etiquetas</label>
                <input className={`${inputClassesReverse} w-[70vw]`} type="text" id="tags" placeholder="Añade una etiqueta" />
            </div>

            <div className="flex flex-col w-full items-center gap-2 p-5 bg-spring-bud mt-3 drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]">
                <label className={`${labelClassesReverse}`} htmlFor="ingredients">Ingredientes</label>
                <input className={`${inputClassesReverse} w-[70vw]`} type="text" id="ingredients" placeholder="Añade un ingrediente" />
            </div>
        </form>

    </section>
}

export default CreateRecipe