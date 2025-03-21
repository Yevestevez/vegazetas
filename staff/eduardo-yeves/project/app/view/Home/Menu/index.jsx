import Header from './Header'

function Menu({ onMyRecipesClicked, onUserLoggedOut }) {
    const handleMyRecipesLinkClick = event => {
        event.preventDefault()

        onMyRecipesClicked()
    }

    const handleUserLoggedOut = () => onUserLoggedOut()


    console.log('Menu -> render')

    // Estilos comunes (TailwindCSS)
    const linkClasses = `
        /* Flexbox */
        flex items-center justify-center

        /* Tamaño y estructura */
        h-[12vw] w-[80vw] pt-[0.5vw]
        
        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]

        /* Estilo de texto */
        anybody-title
        text-[6vw]

        transition-transform duration-150 ease-out
        hover:-translate-y-1 hover:scale-105
        hover:drop-shadow-[2.2vw_2.2vw_0_rgba(0,0,0,0.8)]
    `

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
        hover:bg-folly hover:text-aquamarine
        hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
        hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
        hover:-translate-y-2 hover:scale-105
    `

    return <div className="flex flex-col min-h-screen min-w-screen bg-spring-bud items-center">
        <Header onUserLoggedOut={handleUserLoggedOut} />
        <main className="flex flex-col items-center">
            <div className="mt-5">
                <a className={`${linkClasses} bg-veronica mt-[6vw] text-canary rotate-1 hover:-rotate-2`} href="" onClick={handleMyRecipesLinkClick} >Mis recetas</a>
                <a className={`${linkClasses} bg-coquelicot mt-[6vw] text-aquamarine -rotate-1 hover:rotate-2`} href="" >Las favoritas</a>
                <a className={`${linkClasses} bg-folly mt-[6vw] text-spring-bud rotate-1 hover:-rotate-2`} href="" >¡Listas y más listas!</a>
                <a className={`${linkClasses} bg-canary mt-[6vw] text-coquelicot -rotate-1 hover:rotate-2`} href="" >Menús</a>
                <a className={`${linkClasses} bg-hot-magenta mt-[6vw] text-violet rotate-1 hover:-rotate-2`} href="" >Lista de la compra</a>
                <a className={`${linkClasses} bg-aquamarine mt-[6vw] text-dark-orange -rotate-1 hover:rotate-2`} href="" >Descubre</a>
                <a className={`${linkClasses} bg-dark-orange mt-[6vw] text-veronica rotate-1 hover:-rotate-2`} href="" >Enlaces</a>
            </div>
            <a className={`${btnClasses}flex items-center justify-center text-center bg-folly mt-[8vw] text-spring-bud`} href="" >Nueva<br></br>receta</a>
        </main>
    </div>
}

export default Menu