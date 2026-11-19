import CircleButton from "./CircleButton"

interface ConfirmProps {
    message: string
    onCancel: () => void
    onAccept: () => void
}

function Confirm({ message, onCancel, onAccept }: ConfirmProps) {
    return <div className="fixed inset-0 z-100 flex items-center justify-center bg-folly/40">
        <div className="
            flex flex-col items-center gap-6 xs:gap-8 lg:gap-10 xl:gap-12
            p-6 xs:p-10 md:p-14 xl:p-20
            mx-6 xs:mx-12 sm:mx-14 xl:mx-20
            w-full max-w-xl
            text-center 
            border-8 bg-folly border-spring-bud text-spring-bud
            shadow-hard-2xl
        ">
            <p className="text-base xs:text-lg md:text-xl xl:text-2xl font-black leading-tight">{message}</p>
            <div className="flex row gap-6 xs:gap-8">
                <CircleButton
                    onClick={onCancel} variant="small"
                    className="bg-spring-bud text-folly outline-hidden hover:bg-folly hover:text-spring-bud hover:outline-4 hover:outline-offset-0 hover:outline-spring-bud"
                >
                    Cancelar
                </CircleButton>

                <CircleButton
                    onClick={onAccept} variant="small"
                    className="bg-spring-bud text-folly outline-hidden hover:bg-folly hover:text-spring-bud hover:outline-4 hover:outline-offset-0 hover:outline-spring-bud"
                >
                    Aceptar
                </CircleButton>
            </div>
        </div>
    </div>
}

export default Confirm
