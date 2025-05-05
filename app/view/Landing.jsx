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

    // Estilos comunes para botones
    const btnClasses = `
        /* Layout */
        flex items-center justify-center rounded-full

        /* Tamaño */
        h-[26vw] w-[26vw]
        sm:w-[22vw] sm:h-[22vw]
        md:w-[14vw] md:h-[14vw]
        lg:h-[11vw] lg:w-[11vw]
        xl:h-[10vw] xl:w-[10vw]
        2xl:h-[8vw] 2xl:w-[8vw]
    
        /* Colores */
        bg-spring-bud text-folly
    
        /* Tipografía */
        anybody-logo
    
        /* Sombra */
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
    
        /* Animaciones */
        transition-transform duration-150 ease-out
    
        /* Hover */
        hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
        hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
        hover:-translate-y-2 hover:scale-105
    `

    return <div className="
        /* Layout */
        flex flex-col min-h-screen min-w-screen items-center

        /* Colores */
        bg-folly
    ">
        <h1 className="
            /* Layout */
            text-center mt-[38vw] 
            sm:mt-[24vw] md:mt-[22vw] xl:mt-[10vw]
    
            /* Tipografía */
            anybody-logo text-spring-bud
            text-[30vw]/[80%] 
            sm:text-[28vw]/[80%] 
            md:text-[18vw]/[80%] 
            lg:text-[15vw]/[80%] 
            xl:text-[13vw]/[80%] 
            2xl:text-[11vw]/[80%]
    
            /* Sombra */
            drop-shadow-[0.06em_0.06em_0_rgba(0,0,0,0.8)]
        ">Vega<br></br>zetas</h1>

        <p className="
            /* Layout */
            text-center mt-[10vw]
            sm:mt-[10vw] lg:mt-[3vw]

            /* Tipografía */
            anybody-title text-spring-bud
            text-[8vw]/[120%] 
            sm:text-[8vw]/[120%] 
            lg:text-[2vw]/[120%]
        ">Cook & Cool</p>

        <main className="
            /* Layout */
            flex flex-col sm:flex-row lg:flex-row md:flex-row 
            items-center mt-[16vw] 
            sm:mt-[10vw] lg:mt-[3vw] 
            gap-[8vw]
        ">
            <a className={`
                ${btnClasses}
                
                /* Tipografía */
                text-[clamp(min(7vw,10rem),7vw,10rem)] 
                sm:text-[clamp(min(5vw,10rem),5vw,10rem)]
                md:text-[clamp(min(2vw,10rem),4vw,10rem)] 
                lg:text-[clamp(min(2vw,10rem),3vw,10rem)] 
                xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

                /* Hover */
                hover:bg-violet hover:text-hot-magenta
            `}
                href=""
                onClick={handleLoginLinkClick}>Inicio</a>

            <a className={`
                ${btnClasses}
         
                /* Tipografía */
                text-[clamp(min(5vw,5rem),5vw,5rem)] 
                sm:text-[clamp(min(4vw,10rem),4vw,10rem)] 
                md:text-[clamp(min(2.5vw,10rem),2vw,10rem)] 
                lg:text-[clamp(min(2vw,8rem),1.5vw,8rem)] 
                xl:text-[clamp(min(2vw,8rem),2vw,8rem)] 
                2xl:text-[clamp(min(1.5vw,8rem),1.5vw,8rem)]

                /* Hover */
                hover:bg-canary hover:text-violet
            `}
                href=""
                onClick={handleRegisterLinkClick}>Registro</a>
        </main>
    </div>
}

export default Landing