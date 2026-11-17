import { MdSave } from 'react-icons/md'

import CircleButton from '../../../common/CircleButton'

interface NewStepFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    inputBase: string
    labelBase: string
    inputColor: Record<string, string>
    btnColor: Record<string, string>
}

function NewStepForm({
    onSubmit,
    inputBase,
    labelBase,
    inputColor,
    btnColor
}: NewStepFormProps) {
    const h3Base = `mx-auto px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-xs shadow-hard-md xl:shadow-hard-lg`

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full max-w-2xl mx-auto items-center gap-2 md:gap-4 lg:gap-2">
            <h3 className={`${h3Base} text-folly bg-spring-bud`}>Nuevo Paso</h3>

            <div className="columns-1 lg:columns-2 gap-2 lg:gap-6 text-center w-full">
                <label className={labelBase} htmlFor="text">Instrucciones*</label>
                <textarea
                    id="text" name="text" title="Máximo 800 caracteres" required wrap="soft" maxLength={800}
                    placeholder="Añade las instrucciones del paso"
                    onInput={(e) => {
                        e.currentTarget.style.height = 'auto';
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                    className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight my-2 py-2 px-3`}
                />

                <label className={labelBase} htmlFor="note">Nota</label>
                <textarea
                    id="note" name="note" title="Máximo 500 caracteres" wrap="soft" maxLength={500}
                    placeholder="¿Necesitas aclarar algo?"
                    onInput={(e) => {
                        e.currentTarget.style.height = 'auto';
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                    className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight my-2 py-2 px-3`}
                />
            </div>

            <label className={labelBase} htmlFor="image">Imagen</label>
            <input
                type="url" name="image" title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                placeholder="Pega aquí la url de la imagen"
                className={`${inputBase} ${inputColor.springBud} mb-2`}
            />

            <CircleButton type="submit" aria-label="Guardar" title="Guardar" variant="saveRecipe" className={`${btnColor.springBud} mt-2`}>
                <MdSave aria-hidden="true" />
            </CircleButton>
        </form>
    )
}

export default NewStepForm
