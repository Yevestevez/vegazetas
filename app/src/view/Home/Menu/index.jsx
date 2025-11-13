import { useAppContext } from '../../../context'

import MenuHeader from './MenuHeader'
import MenuButton from './MenuButton'
import CircleButton from '../../common/CircleButton'
import Footer from '../../common/Footer'

function Menu({ onUserLoggedOut, onCreateRecipeClicked }) {
    const { alert } = useAppContext()

    const handleUserLoggedOut = () => onUserLoggedOut()

    const handleCreateRecipeClick = event => {
        event.preventDefault()

        onCreateRecipeClicked()
    }

    return <div className="flex flex-col min-h-screen min-w-screen items-center bg-spring-bud gap-6 xs:gap-8 xl:gap-12">
        <MenuHeader onUserLoggedOut={handleUserLoggedOut} />
        <main className="flex flex-col items-center w-full px-8 xs:px-12 sm:px-14 gap-6 xs:gap-8 xl:gap-12 pb-6 max-w-7xl">
            <nav className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 xs:gap-8 md:gap-10 [&>:last-child]:md:col-span-2 [&>:last-child]:md:flex [&>:last-child]:md:justify-center">

                <MenuButton to="/my-recipes" className="bg-veronica text-canary">Mis recetas</MenuButton>

                <MenuButton variant="even" className="bg-coquelicot text-aquamarine opacity-50" onClick={(event) => {
                    event.preventDefault()
                    alert('Funcionalidad cociendose a fuego lento')
                }}>Las favoritas</MenuButton>

                <MenuButton className="bg-folly text-spring-bud opacity-50" onClick={(event) => {
                    event.preventDefault()
                    alert('Funcionalidad en el horno')
                }}>¡Listas y más listas!</MenuButton>

                <MenuButton variant="even" className="bg-canary text-coquelicot opacity-50" onClick={(event) => {
                    event.preventDefault()
                    alert('Funcionalidad salteándose con un chorro de aceite')
                }}>Menús</MenuButton>

                <MenuButton className="bg-hot-magenta text-violet opacity-50" onClick={(event) => {
                    event.preventDefault()
                    alert('Funcionalidad burbujeando en la olla')
                }}>Lista de la compra</MenuButton>

                <MenuButton variant="even" className="bg-aquamarine text-dark-orange opacity-50" onClick={(event) => {
                    event.preventDefault()
                    alert('Funcionalidad cociendose a fuego lento')
                }}>Descubre</MenuButton>

                <MenuButton className="bg-dark-orange text-veronica opacity-50" onClick={(event) => {
                    event.preventDefault()
                    alert('Funcionalidad en el horno')
                }}>Enlaces</MenuButton>
            </nav>

            <CircleButton
                type='button'
                onClick={handleCreateRecipeClick}
                className="bg-folly text-spring-bud hover:bg-spring-bud hover:text-folly outline-none hover:outline hover:outline-4 hover:outline-offset-0 hover:outline-folly xs:text-lg"
            >Nueva <br></br> receta</CircleButton>
        </main>
        <Footer />
    </div >
}

export default Menu