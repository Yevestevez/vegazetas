function Alert({ message, onAccept }) {
    const btnClasses = `
        /* Layout */
        rounded-full flex items-center justify-center

        /* Tipografía */
        anybody-logo

        /* Colores */
        bg-spring-bud text-folly

        /* Tamaño */
        w-[20vw] h-[20vw]
        sm:w-[18vw] sm:h-[18vw]
        md:w-[14vw] md:h-[14vw]
        xl:w-[8vw] xl:h-[8vw]

        /* Tipografía */
        text-[clamp(min(3.5vw,10rem),3.5vw,10rem)]
        md:text-[clamp(min(2vw,8rem),2.6vw,10rem)]
        lg:text-[clamp(min(2vw,7rem),2.2vw,10rem)]
        xl:text-[clamp(min(1.6vw,5rem),1.4vw,10rem)]

        /* Sombra */
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]
        md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
        lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
        xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
        hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)]
        hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)]
        hover:lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)]
        hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.7)]
        
        /* Interacciones */
        transition-transform duration-150 ease-out
        hover:-translate-y-2 hover:scale-105
    `
    return <div className="
        /* Layout */
        flex justify-center items-center w-full h-full fixed top-0 mx-auto
        z-10

        /* Colores */
        bg-folly/50
    ">
        <div className="
            /* Layout */
            flex flex-col mx-auto p-10 items-center justify-center text-center gap-[2vw]
            w-[70%] h-[40%]
            sm:w-[80%] sm:h-[40%]
            md:w-[60%] md:h-[40%]
            xl:w-[60%] xl:h-[50%]

            /* Colores */
            bg-folly border-8 border-spring-bud text-spring-bud

            /* Sombra */
            drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]
        ">
            <p className="
                /* Tipografía */
                anybody font-extrabold ext-[5vw]/[120%] sm:text-[4vw]/[120%] xl:text-[2vw]/[120%]
            ">{message}</p>

            <button className={btnClasses} type="button" onClick={onAccept}>Aceptar</button>
        </div>
    </div>
}

export default Alert