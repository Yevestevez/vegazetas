function Confirm({ message, onCancel, onAccept }) {
    const btnClasses = `
        /* Layout */
        flex items-center justify-center self-end rounded-full anybody-logo
        mt-[6vw] sm:mt-[3vw] xl:mt-[2vw]

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
    return <div className="flex justify-center items-center w-full h-full fixed top-0 z-10 bg-folly/50">
        <div className="
            flex flex-col mx-auto p-[10vw] items-center justify-center text-center gap-[2vw]
            w-[70%] h-[40%]
            sm:w-[80%] sm:h-[40%]
            md:w-[60%] md:h-[40%]
            xl:w-[60%] xl:h-[50%]
            bg-folly border-8 border-spring-bud text-spring-bud drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]">
            <p className="anybody font-extrabold
            text-[5vw]/[120%] sm:text-[4vw]/[120%] xl:text-[2vw]/[120%]">{message}</p>
            <div className="flex row gap-[5vw]">
                <button className={`${btnClasses} flex items-center justify-center bg-violet text-folly`} type="button" onClick={onCancel}>Cancelar</button>

                <button className={`${btnClasses} flex items-center justify-center bg-spring-bud text-folly`} type="button" onClick={onAccept}>Aceptar</button>
            </div>
        </div>
    </div>
}

export default Confirm