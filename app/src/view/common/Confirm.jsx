import CircleButton from "./CircleButton"

function Confirm({ message, onCancel, onAccept }) {
    return <div className="fixed top-0 z-10 flex items-center justify-center w-full h-full mx-auto bg-folly bg-opacity-70">
        <div className="
            flex flex-col items-center justify-center mx-auto text-center
            gap-4 xs:gap-8 p-4 xs:p-10 md:p-24 lg:p-48
            border-8 bg-folly border-spring-bud text-spring-bud
            shadow-[0.8rem_0.8rem_0_0_rgba(0,0,0,0.8)]">
            <p className="text-lg xs:text-2xl font-black leading-6 anybody">{message}</p>
            <div className="flex row gap-4 xs:gap-8">
                <CircleButton
                    onClick={onCancel}
                    className="bg-spring-bud text-folly outline-none hover:bg-folly hover:text-spring-bud hover:outline hover:outline-4 hover:outline-offset-0 hover:outline-spring-bud"
                >
                    Cancelar
                </CircleButton>

                <CircleButton
                    onClick={onAccept}
                    className="bg-spring-bud text-folly outline-none hover:bg-folly hover:text-spring-bud hover:outline hover:outline-4 hover:outline-offset-0 hover:outline-spring-bud"
                >
                    Aceptar
                </CircleButton>
            </div>
        </div>
    </div>
}

export default Confirm