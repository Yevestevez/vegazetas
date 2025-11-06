import CircleButton from "./common/CircleButton"
import LogoVegazetas from "./common/LogoVegazetas"

function Landing() {
    return <div className="flex flex-col min-h-screen min-w-screen items-center justify-center gap-8 xl:gap-12 bg-folly">
        <header>
            <LogoVegazetas className="text-spring-bud" />
        </header>

        <main className="flex flex-col gap-10 xl:gap-12">
            <p className="text-center anybody-title text-spring-bud text-4xl lg:text-5xl xl:text-6xl">Cook & Cool
            </p>
            <nav className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
                <CircleButton
                    to="/login"
                    className="bg-spring-bud text-folly hover:bg-violet hover:text-hot-magenta"
                >Inicio</CircleButton>

                <CircleButton
                    to="/register"
                    className="bg-spring-bud text-folly hover:bg-canary hover:text-violet"
                >Registro</CircleButton>
            </nav>
        </main>
    </div>
}

export default Landing