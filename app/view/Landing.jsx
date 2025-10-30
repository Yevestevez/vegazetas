import { Link } from "react-router-dom"

function Landing() {
    const btnClasses = `
        flex items-center justify-center rounded-full
        h-[26vw] sm:h-[22vw] md:h-[18vw] lg:h-[18vw] xl:h-[9vw] 2xl:h-[8vw]
        w-[26vw] sm:w-[22vw] md:w-[18vw] lg:w-[18vw] xl:w-[9vw] 2xl:w-[8vw]
        bg-spring-bud text-folly anybody-logo
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)] 2xl:drop-shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.8)]
        hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)] hover:lg:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)] hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.7)] hover:2xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.7)]
        transition-transform duration-150 ease-out hover:-translate-y-2 hover:scale-105
    `

    return <div className="flex flex-col min-h-screen min-w-screen items-center gap-[14vw] sm:gap-[10vw] md:gap-[8vw] xl:gap-[4vw] 2xl:gap-[3vw] bg-folly">
        <h1 className="
                text-center mt-[38vw] sm:mt-[24vw] md:mt-[22vw] xl:mt-[6vw] anybody-logo text-spring-bud drop-shadow-[0.06em_0.06em_0_rgba(0,0,0,0.8)]
                text-[30vw]/[80%] sm:text-[28vw]/[80%] md:text-[24vw]/[80%] xl:text-[12vw]/[80%] 2xl:text-[11vw]/[80%]
            ">Vega<br></br>zetas
        </h1>

        <p className="
                text-center anybody-title text-spring-bud
                text-[8vw]/[120%] sm:text-[8vw]/[120%] md:text-[7vw]/[120%] xl:text-[4.5vw]/[120%] 2xl:text-[4vw]/[120%]
            ">Cook & Cool
        </p>

        <main className="flex flex-col sm:flex-row lg:flex-row md:flex-row items-center gap-[8vw] xl:gap-[5vw] 2xl:gap-[4vw]">
            <Link className={`
                    ${btnClasses}
                    text-[clamp(1.8rem,7vw,10rem)] sm:text-[clamp(2.5rem,5vw,10rem)] md:text-[clamp(2.5rem,4vw,10rem)] xl:text-[clamp(2rem,2.2vw,10rem)] 2xl:text-[clamp(2rem,2vw,10rem)]
                    hover:bg-violet hover:text-hot-magenta
                `}
                to="/login"
            >Inicio</Link>

            <Link className={`
                    ${btnClasses}
                    text-[clamp(1rem,5vw,10rem)] sm:text-[clamp(1.8rem,4vw,10rem)] md:text-[clamp(1.8rem,3vw,10rem)] xl:text-[clamp(1rem,1.8vw,10rem)] 2xl:text-[clamp(1rem,1.6vw,10rem)]
                    hover:bg-canary hover:text-violet
                `}
                to="/register"
            >Registro</Link>
        </main>
    </div>
}

export default Landing