function Alert({ message, onAccept }) {
    const btnClasses = `
    rounded-full 

    /* Tamaño */
    h-[20vw] w-[20vw]

    /* Sombra */
    drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)]

    /* Estilo de texto */
    anybody-logo
    text-4

    /* Hover y animaciones */
    transition-transform duration-150 ease-out
    hover:bg-folly hover:text-spring-bud hover:border-spring-bud hover:border-5
    hover:drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.7)]
    hover:-translate-y-2 hover:scale-105
`
    return <div className="flex justify-center items-center w-full h-full fixed top-0 z-10 bg-folly/50">
        <div className="flex flex-col mx-auto p-10 items-center justify-center text-center gap-6 w-[70%] h-75 bg-folly border-8 border-spring-bud text-spring-bud drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]">
            <p className="anybody font-extrabold text-[5vw]/[120%]">{message}</p>

            <button className={`${btnClasses} flex items-center justify-center bg-spring-bud text-folly`} type="button" onClick={onAccept}>Aceptar</button>
        </div>
    </div>
}

export default Alert