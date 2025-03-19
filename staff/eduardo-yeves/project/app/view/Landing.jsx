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

    // Estilos comunes (TailwindCSS)
    const logoClasses = `
        /* Margen superior */
        mt-[15vh] md:mt-[12vh] xl:mt-[10vh]
    
        /* Sombra */
        drop-shadow-[0.06em_0.06em_0_rgba(0,0,0,0.8)]
    
        /* Texto */
        text-spring-bud anybody-logo text-center
    
        /* Tamaño del texto con responsive */
        text-[30vw]/[80%] 
        sm:text-[22vw]/[80%] 
        md:text-[18vw]/[80%] 
        lg:text-[15vw]/[80%] 
        xl:text-[13vw]/[80%] 
        2xl:text-[11vw]/[80%]
    `

    const titleClasses = `
        /* Color y tipografía */
        text-spring-bud anybody-title text-center
    
        /* Espaciado */
        mt-[5vw] lg:mt-[3vw]
    
        /* Tamaño de texto con responsive */
        text-[4vw]/[120%] 
        sm:text-[3vw]/[120%] 
        lg:text-[2vw]/[120%] 
    
        /* Ancho responsive */
        w-[60vw] 
        sm:w-[40vw] 
        lg:w-[30vw]
    `

    const btnClasses = `
        flex items-center justify-center
        bg-spring-bud rounded-full
    
        /* Tamaño base */
        h-[22vw] w-[22vw]
    
        /* Responsive */
        sm:w-[18vw] sm:h-[18vw]
        md:w-[14vw] md:h-[14vw]
        lg:h-[11vw] lg:w-[11vw]
        xl:h-[10vw] xl:w-[10vw]
        2xl:h-[8vw] 2xl:w-[8vw]
    
        /* Sombra */
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
    
        /* Texto */
        text-folly anybody-logo
    
        /* Animaciones */
        transition-transform duration-150 ease-out
    
        /* Hover */
        hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
        hover:lg:drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.7)]
        hover:-translate-y-2 hover:scale-105
    `

    return <div className="flex flex-col min-h-screen min-w-screen bg-folly items-center">
        <h1 className={logoClasses}>Vega<br></br>zetas</h1>

        <p className={titleClasses}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>

        <main className="flex flex-col sm:flex-row lg:flex-row md:flex-row items-center mt-[10vw] sm:mt-[5vw] lg:mt-[3vw] gap-[5vw]">
            <a className={`
            ${btnClasses}
            
            /* Responsive */
            text-[clamp(min(5vw,10rem),5vw,10rem)] md:text-[clamp(min(2vw,10rem),4vw,10rem)] lg:text-[clamp(min(2vw,10rem),3vw,10rem)] xl:text-[clamp(min(1vw,10rem),2vw,10rem)]

            /* Hover */
            hover:bg-violet hover:text-hot-magenta
            `}
                href=""
                onClick={handleLoginLinkClick}>Inicio</a>

            <a className={`
            ${btnClasses}
         
            /* Responsive */
            text-[clamp(min(4vw,5rem),4vw,5rem)] sm:text-[clamp(min(3vw,10rem),2vw,10rem)] md:text-[clamp(min(2.5vw,10rem),2vw,10rem)] lg:text-[clamp(min(2vw,8rem),1.5vw,8rem)] xl:text-[clamp(min(2vw,8rem),2vw,8rem)] 2xl:text-[clamp(min(1.5vw,8rem),1.5vw,8rem)]

            /* Hover */
            hover:bg-canary hover:text-violet
            `}
                href="" onClick={handleRegisterLinkClick}>Registro</a>
        </main>
    </div>
}

export default Landing