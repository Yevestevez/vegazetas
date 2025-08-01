function Alert({ message, onAccept, isWakingServer = false }) {
    return <div className="flex justify-center items-center w-full h-full fixed top-0 mx-auto z-10 bg-folly/50">
        <div className="
            flex flex-col mx-auto p-10 items-center justify-center text-center gap-[2vw]

            w-[70%] sm:w-[80%] md:w-[60%] xl:w-[60%]
            h-[40%] sm:h-[40%] md:h-[40%] xl:h-[50%]

            bg-folly border-8 border-spring-bud text-spring-bud
            drop-shadow-[2vw_2vw_0_rgba(0,0,0,0.8)]
        ">
            {isWakingServer && (
                <svg
                    className="animate-spin h-12 w-12 text-spring-bud mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            )}
            <p className="anybody font-extrabold text-[5vw]/[120%] sm:text-[4vw]/[120%] xl:text-[2vw]/[120%]">{message}</p>

            <button
                type="button" onClick={onAccept}
                className="
                    rounded-full flex items-center justify-center anybody-logo bg-spring-bud text-folly

                    w-[20vw] sm:w-[18vw] md:w-[14vw] xl:w-[8vw]
                    h-[20vw] sm:h-[18vw] md:h-[14vw] xl:h-[8vw]

                    text-[clamp(1rem,3.5vw,10rem)] md:text-[clamp(1rem,2.6vw,10rem)] lg:text-[clamp(1.6rem,2vw,10rem)] xl:text-[clamp(1.2rem,1.4vw,10rem)]

                    drop-shadow-[1.5vw_1.5vw_0_rgba(0,0,0,0.8)] md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)] lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)] xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                    hover:drop-shadow-[1.7vw_1.7vw_0_rgba(0,0,0,0.7)] hover:md:drop-shadow-[1.4vw_1.4vw_0_rgba(0,0,0,0.7)] hover:lg:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.7)] hover:xl:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.7)]

                    transition-transform duration-150 ease-out hover:-translate-y-2 hover:scale-105
                "
            >
                Aceptar
            </button>
        </div>
    </div>
}

export default Alert