function Landing({ onLoginClicked, onRegisterClicked }) {
    const handleLoginLinkClick = event => {
        event.preventDefault()

        onLoginClicked()
    }

    const handleRegisterLinkClick = event => {
        event.preventDefault()

        onRegisterClicked()
    }

    console.log('Landing -> render')

    return <div className="flex flex-col min-h-screen min-w-screen bg-folly items-center">
        <h1 className="
        mt-[15vh] md:mt-[12vh] xl:mt-[10vh]
        drop-shadow-[0.06em_0.06em_0_rgba(0,0,0,0.8)]

        text-spring-bud anybody-logo
        text-[30vw]/[80%] sm:text-[22vw]/[80%] md:text-[18vw]/[80%] lg:text-[15vw]/[80%] xl:text-[13vw]/[80%] 2xl:text-[11vw]/[80%] text-center
        ">Vega<br></br>zetas</h1>

        <p className="text-spring-bud anybody-title mt-[5vw] lg:mt-[3vw] text-[4vw]/[120%] sm:text-[3vw]/[120%] lg:text-[2vw]/[120%] w-[60vw] sm:w-[40vw] lg:w-[30vw] text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>

        <div className="flex flex-col sm:flex-row lg:flex-row md:flex-row items-center mt-[10vw] sm:mt-[5vw] lg:mt-[3vw] gap-[5vw]">
            <a className="
            flex
            bg-spring-bud rounded-full
            items-center justify-center
            h-[22vw] w-[22vw] sm:w-[18vw] sm:h-[18vw] md:w-[14vw] md:h-[14vw] lg:h-[11vw] lg:w-[11vw] xl:h-[10vw] xl:w-[10vw] 2xl:h-[8vw] 2xl:w-[8vw]
            drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

            text-folly anybody-logo
            text-[clamp(min(5vw,10rem),5vw,10rem)] md:text-[clamp(min(2vw,10rem),4vw,10rem)] lg:text-[clamp(min(2vw,10rem),3vw,10rem)] xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

            transition-transform duration-150 ease-out
            hover:bg-violet hover:text-hot-magenta
            hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)] hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
            hover:-translate-y-2 hover:scale-105
            "
                href=""
                onClick={handleLoginLinkClick}>Inicio</a>

            <a className="
            flex
            bg-spring-bud rounded-full
            items-center justify-center
            h-[22vw] w-[22vw] sm:w-[18vw] sm:h-[18vw] md:w-[14vw] md:h-[14vw] lg:h-[11vw] lg:w-[11vw] xl:h-[10vw] xl:w-[10vw] 2xl:h-[8vw] 2xl:w-[8vw]
            drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]

            text-folly anybody-logo
            text-[clamp(min(4vw,5rem),4vw,5rem)] sm:text-[clamp(min(3vw,10rem),2vw,10rem)] md:text-[clamp(min(2.5vw,10rem),2vw,10rem)] lg:text-[clamp(min(2vw,8rem),1.5vw,8rem)] xl:text-[clamp(min(2vw,8rem),2vw,8rem)] 2xl:text-[clamp(min(1.5vw,8rem),1.5vw,8rem)]

            transition-transform duration-150 ease-out
            hover:bg-canary hover:text-violet
            hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)] hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
            hover:-translate-y-2 hover:scale-105
            "
                href="" onClick={handleRegisterLinkClick}>Registro</a>
        </div>
    </div>
}

export default Landing