import CircleButton from "./CircleButton"

function Alert({ message, onAccept, isWakingServer = false }) {
    return <div className="fixed top-0 z-10 flex items-center justify-center w-full h-full mx-auto bg-folly bg-opacity-70">
        <div className="
            flex flex-col items-center justify-center gap-4 xs:gap-8 p-4 xs:p-10 md:p-24 lg:p-48 mx-auto text-center 
            border-8 bg-folly border-spring-bud text-spring-bud
            shadow-[0.8rem_0.8rem_0_0_rgba(0,0,0,0.8)]
        ">
            {isWakingServer && (
                <svg
                    className="size-12 mb-4 text-spring-bud animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            )}
            <p className="text-lg xs:text-2xl font-black leading-6 anybody">{message}</p>

            <CircleButton
                onClick={onAccept}
                className="bg-spring-bud text-folly outline-none hover:bg-folly hover:text-spring-bud hover:outline hover:outline-4 hover:outline-offset-0 hover:outline-spring-bud"
            >
                Aceptar
            </CircleButton>
        </div>
    </div>
}

export default Alert