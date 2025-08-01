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

    const linkClasses = `
        flex items-center justify-center
        pt-[1vw] sm:pt-[0.8vw] xl:pt-[0.4vw]
        
        h-[12vw] sm:h-[9vw] md:h-[8vw] xl:h-[5.5vw]
        w-[80vw] xl:w-[40vw]
        
        anybody-title text-[6vw] sm:text-[5.5vw] md:text-[5vw] xl:text-[4vw]

        drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
        hover:drop-shadow-[1.8w_1.8vw_0_rgba(0,0,0,0.8)] hover:sm:drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)] hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

        transition-transform duration-150 ease-out hover:-translate-y-1 hover:scale-105
    `

    return <div className="flex flex-col min-h-screen min-w-screen items-center bg-spring-bud">
        <Header onUserLoggedOut={handleUserLoggedOut} />
        <main className="flex flex-col items-center">
            <div className="flex flex-col xl:flex-row mt-[6vw] sm:mt-[5vw] xl:mt-[4vw] gap-[6vw] sm:gap-[5.5vw] md:gap-[4.5vw] xl:gap-[6vw]">
                <div className="flex flex-col gap-[6vw] sm:gap-[5.5vw] md:gap-[4.5vw] xl:gap-[3vw]">
                    <a className={`${linkClasses} rotate-1 hover:-rotate-2 bg-veronica text-canary`} href="#" onClick={handleMyRecipesLinkClick}>Mis recetas</a>
                    <a className={`${linkClasses} -rotate-1 hover:rotate-2 bg-coquelicot text-aquamarine opacity-50`} href="#" onClick={(event) => {
                            event.preventDefault()
                            alert('Funcionalidad cociendose a fuego lento')
                        }}>Las favoritas</a>
                    <a className={`${linkClasses} rotate-1 hover:-rotate-2 bg-folly text-spring-bud opacity-50`} href="#" onClick={(event) => {
                            event.preventDefault()
                            alert('Funcionalidad en el horno')
                        }}>¡Listas y más listas!</a>
                    <a className={`${linkClasses} -rotate-1 hover:rotate-2 bg-canary text-coquelicot opacity-50`} href="#" onClick={(event) => {
                            event.preventDefault()
                            alert('Funcionalidad salteándose con un chorro de aceite')
                        }}>Menús</a>
                </div>
                <div className="flex flex-col gap-[6vw] sm:gap-[5.5vw] md:gap-[4.5vw] xl:gap-[3vw]">
                    <a className={`${linkClasses} rotate-1 hover:-rotate-2 bg-hot-magenta text-violet opacity-50`} href="#" onClick={(event) => {
                            event.preventDefault()
                            alert('Funcionalidad burbujeando en la olla')
                        }}>Lista de la compra</a>
                    <a className={`${linkClasses} -rotate-1 hover:rotate-2 bg-aquamarine text-dark-orange opacity-50`} href="#" onClick={(event) => {
                            event.preventDefault()
                            alert('Funcionalidad cociendose a fuego lento')
                        }}>Descubre</a>
                    <a className={`${linkClasses} rotate-1 hover:-rotate-2 bg-dark-orange text-veronica opacity-50`} href="#" onClick={(event) => {
                            event.preventDefault()
                            alert('Funcionalidad cociendose en el horno')
                        }}>Enlaces</a>
                </div>
            </div>
            <button type='button' className="
                flex items-center justify-center text-center rounded-full
                mt-[6vw] sm:mt-[5vw] xl:mt-[4vw] mb-[6vw] xl:mb-[4vw]
                h-[20vw] sm:h-[16vw] md:h-[14vw] xl:h-[12vw]
                w-[20vw] sm:w-[16vw] md:w-[14vw] xl:w-[12vw]

                anybody-logo  bg-folly text-aquamarine
                text-[clamp(4vw,4vw,10rem)]/[100%] sm:text-[clamp(3vw,3vw,10rem)] md:text-[clamp(2vw,3vw,10rem)] xl:text-[clamp(1.5vw,2.5vw,10rem)]

                drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                hover:hover:drop-shadow-[1.8vw_1.8vw_0_rgba(0,0,0,0.8)] hover:sm:drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)] hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.8)] hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

                transition-transform duration-150 ease-out hover:-translate-y-2 hover:scale-105 hover:bg-aquamarine hover:text-folly
            "
                onClick={handleCreateRecipeClick}>Nueva<br></br>receta</button>
        </main>
    </div>
}

export default Menu