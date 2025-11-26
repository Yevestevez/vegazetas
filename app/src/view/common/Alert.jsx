import CircleButton from "./CircleButton"

function Alert({ message, onAccept, isWakingServer = false }) {
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-folly bg-opacity-70">
        <div className="
            flex flex-col items-center gap-6 xs:gap-8 lg:gap-10 xl:gap-12
            p-6 xs:p-10 md:p-14 xl:p-20
            mx-6 xs:mx-12 sm:mx-14 xl:mx-20
            w-full max-w-xl
            text-center 
            border-8 bg-folly border-spring-bud text-spring-bud
            shadow-[0.6rem_0.6rem_0_0_rgba(0,0,0,0.8)] lg:shadow-[0.8rem_0.8rem_0_0_rgba(0,0,0,0.8)]
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
            <p className="text-base xs:text-lg md:text-xl xl:text-2xl font-black leading-tight xs:leading-tight md:leading-tight xl:leading-tight">{message}</p>

            <CircleButton
                onClick={onAccept} variant="small"
                className="bg-spring-bud text-folly outline-none hover:bg-folly hover:text-spring-bud hover:outline hover:outline-4 hover:outline-offset-0 hover:outline-spring-bud"
            >
                Aceptar
            </CircleButton>
        </div>
    </div>
}

export default Alert