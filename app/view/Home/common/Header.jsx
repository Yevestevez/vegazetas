import logic from '../../../logic'
import { useAppContext } from '../../../context'
import { FaRegUserCircle } from "react-icons/fa"

function Header({ onUserLoggedOut, onLogoClicked }) {
    const { alert, confirm } = useAppContext()

    const handleLogoutButtonClick = () => {
        confirm('¿Quieres cerrar sesión?', accepted => {
            if (accepted) {
                try {
                    logic.logoutUser()

                    onUserLoggedOut()
                } catch (error) {
                    alert(error.message)

                    console.error(error)
                }
            }
        })
    }

    const handleLogoLinkClick = event => {
        event.preventDefault()

        onLogoClicked()
    }

    console.log('Header -> render')

    return <div className="
        fixed top-0 xl:left-0 z-10 flex flex-row xl:flex-col justify-between xl:items-end bg-veronica
        w-full xl:w-[40vw] xl:h-[45vh] xl:overflow-y-auto
        py-[4vw] sm:py-[3vw] xl:py-[0vw] px-[8vw] sm:px-[6vw] md:px-[5vw] xl:px-[0vw]
        ">
        <div className="flex flex-row xl:flex-col items-center h-full w-full xl:w-[20vw] justify-between xl:justify-center xl:gap-[3vw]">
            <a href="#" onClick={handleLogoLinkClick}>
                <h1 className="text-center anybody-logo text-sgbus-green drop-shadow-[0.12em_0.12em_0_rgba(0,0,0,0.8)] text-[8vw]/[80%] sm:text-[7vw]/[80%] md:text-[6vw]/[80%] xl:text-[4.5vw]/[80%]">Vega<br></br>zetas</h1>
            </a>

            <div className="flex flex-row xl:flex-col gap-[2vw] xl:gap-[1vw] items-center align-middle justify-center">
                <button
                    className="anybody text-[2.7vw]/[120%] xl:text-[0.7vw]/[120%] text-sgbus-green order-1 xl:order-2 cursor-pointer"
                    type="button"
                    onClick={handleLogoutButtonClick}>
                        Cerrar<br className="xl:hidden"></br> sesión
                </button>

                <FaRegUserCircle className="
                    rounded-full mr-[2vw] sm:mr-[0.5vw] xl:mr-[0.5vw] order-2 xl:order-1
                    text-[13vw] sm:text-[11vw] md:text-[10vw] xl:text-[5vw] text-sgbus-green bg-veronica
                    drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] sm:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.4vw_0.4vw_0_rgba(0,0,0,0.8)]
                " />
            </div>
        </div>
    </div>
}

export default Header