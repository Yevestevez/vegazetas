function Alert({ message, onAccept }) {
    const btnClasses = `
        /* Layout */
        rounded-full flex items-center justify-center

        /* Tamaño */
        h-[20vw] w-[20vw]

        /* Tipografía */
        anybody-logo text-4

        /* Colores */
        bg-spring-bud text-folly

        /* Sombra */
        drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]

        /* Animaciones */
        transition-transform duration-150 ease-out

        /* Hover */
        hover:bg-folly hover:text-spring-bud hover:border-spring-bud hover:border-5
        hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
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
            flex flex-col mx-auto p-10 items-center justify-center text-center gap-6
            w-[70vw] h-[75vw]

            /* Colores */
            bg-folly border-8 border-spring-bud text-spring-bud

            /* Sombra */
            drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]
        ">
            <p className="
                /* Tipografía */
                anybody font-extrabold text-[5vw]/[120%]
            ">{message}</p>

            <button className={btnClasses} type="button" onClick={onAccept}>Aceptar</button>
        </div>
    </div>
}

export default Alert