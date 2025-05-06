import { useAppContext } from '../../../context'

import Header from './Header'

function Menu({ onMyRecipesClicked, onUserLoggedOut, onCreateRecipeClicked }) {
    const { alert } = useAppContext()

    const handleMyRecipesLinkClick = event => {
        event.preventDefault()

        onMyRecipesClicked()
    }

    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleCreateRecipeClick = event => {
        event.preventDefault()

        onCreateRecipeClicked()
    }

    console.log('Menu -> render')

    const linkClasses = `
        /* Layout */
        flex items-center justify-center
        h-[12vw] sm:h-[9vw] md:h-[8vw] w-[80vw] pt-[1vw]
        mt-[6vw] sm:mt-[5vw] md:mt-[4.5vw]

        /* Tipografía */
        anybody-title text-[6vw] md:text-[5vw]

        /* Sombra */
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]

        /* Animaciones */
        transition-transform duration-150 ease-out
        hover:-translate-y-1 hover:scale-105
        hover:drop-shadow-[2.2vw_2.2vw_0_rgba(0,0,0,0.8)]
        hover:md:drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)]
    `

    return <div className="
        /* Layout */
        flex flex-col min-h-screen min-w-screen items-center

        /* Colores */
        bg-spring-bud
    ">
        <Header onUserLoggedOut={handleUserLoggedOut} />
        <main className="
            /* Layout */
            flex flex-col items-center
        ">
            <div className="
                /* Layout */
                mt-[1.5vw] sm:mt-[1vw]
            ">
                <a className={`
                    ${linkClasses}
                    
                    /* Layout y Hover */
                    rotate-1 hover:-rotate-2
                    
                    /* Colores */
                    bg-veronica text-canary
                `} href="" onClick={handleMyRecipesLinkClick}>Mis recetas</a>
                <a className={`
                    ${linkClasses}
                    
                    /* Layout y Hover */
                    -rotate-1 hover:rotate-2
                    
                    /* Colores */
                    bg-coquelicot text-aquamarine opacity-50
                `} href="" onClick={(event) => {
                        event.preventDefault()
                        alert('Funcionalidad cociendose a fuego lento')
                    }}>Las favoritas</a>
                <a className={`
                    ${linkClasses}
                    
                    /* Layout y Hover */
                    rotate-1 hover:-rotate-2
                    
                    /* Colores */
                    bg-folly text-spring-bud opacity-50
                `} href="" onClick={(event) => {
                        event.preventDefault()
                        alert('Funcionalidad en el horno')
                    }}>¡Listas y más listas!</a>
                <a className={`
                    ${linkClasses}
                    
                    /* Layout y Hover */
                    -rotate-1 hover:rotate-2
                    
                    /* Colores */
                    bg-canary text-coquelicot opacity-50
                `} href="" onClick={(event) => {
                        event.preventDefault()
                        alert('Funcionalidad salteándose con un chorro de aceite')
                    }}>Menús</a>
                <a className={`
                    ${linkClasses}
                    
                    /* Layout y Hover */
                    rotate-1 hover:-rotate-2
                    
                    /* Colores */
                    bg-hot-magenta text-violet opacity-50
                `} href="" onClick={(event) => {
                        event.preventDefault()
                        alert('Funcionalidad burbujeando en la olla')
                    }}>Lista de la compra</a>
                <a className={`
                    ${linkClasses}
                    
                    /* Layout y Hover */
                    -rotate-1 hover:rotate-2
                    
                    /* Colores */
                    bg-aquamarine text-dark-orange opacity-50
                `} href="" onClick={(event) => {
                        event.preventDefault()
                        alert('Funcionalidad cociendose a fuego lento')
                    }}>Descubre</a>
                <a className={`
                    ${linkClasses}
                    
                    /* Layout y Hover */
                    rotate-1 hover:-rotate-2
                    
                    /* Colores */
                    bg-dark-orange text-veronica opacity-50
                `} href="" onClick={(event) => {
                        event.preventDefault()
                        alert('Funcionalidad cociendose en el horno')
                    }}>Enlaces</a>
            </div>
            <button type='button' className="
                /* Layout */
                flex items-center justify-center text-center
                rounded-full mt-[6vw] sm:mt-[5vw] md:mb-[6vw]

                /* Tamaño */
                h-[20vw] w-[20vw]
                sm:w-[16vw] sm:h-[16vw]
                md:w-[14vw] md:h-[14vw]
                lg:h-[11vw] lg:w-[11vw]
                xl:h-[10vw] xl:w-[10vw]
                2xl:h-[8vw] 2xl:w-[8vw]

                /* Tipografía */
                anybody-logo
                text-[clamp(min(4vw,10rem),4vw,10rem)]/[100%]
                sm:text-[clamp(min(3vw,10rem),3vw,10rem)]
                md:text-[clamp(min(2vw,10rem),3vw,10rem)]
                lg:text-[clamp(min(2vw,10rem),3vw,10rem)]
                xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

                /* Colores */
                bg-folly text-spring-bud

                /* Sombra */
                drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
                md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

                /* Animaciones */
                transition-transform duration-150 ease-out
                hover:-translate-y-2 hover:scale-105
                hover:bg-aquamarine hover:text-folly
                hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)]
                hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)]
                hover:lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)]
            "
                onClick={handleCreateRecipeClick}>Nueva<br></br>receta</button>
        </main>
    </div>
}

export default Menu