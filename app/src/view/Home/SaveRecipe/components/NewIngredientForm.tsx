import { MdSave } from 'react-icons/md'

import CircleButton from '../../../common/CircleButton'

interface NewIngredientFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    inputBase: string
    labelBase: string
    inputColor: Record<string, string>
    btnColor: Record<string, string>
}

function NewIngredientForm({
    onSubmit,
    inputBase,
    labelBase,
    inputColor,
    btnColor
}: NewIngredientFormProps) {
    const h3Base = `mx-auto px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-xs shadow-hard-md xl:shadow-hard-lg`

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full max-w-2xl mx-auto items-center gap-2 md:gap-4 text-folly">
            <h3 className={`${h3Base} text-spring-bud bg-folly`}>Nuevo ingrediente</h3>

            <label className={labelBase} htmlFor="name">Nombre*</label>
            <input
                id="name" type="text" name="name" required title="Solo letras, números, espacios y caracteres especiales como -_'(),.%/+&. Máximo 50 caracteres" autoComplete="off"
                placeholder="Añade un nombre al ingrediente" maxLength={50} pattern="^\s*[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9\s\-_'(),.%/+&]{1,50}\s*$"
                className={`${inputBase} ${inputColor.folly} mb-2`}
            />
            <div className="flex flex-row gap-4 pb-2 w-full">
                <div className="flex flex-col w-full gap-2">
                    <label className={`${labelBase} text-center`} htmlFor="quantity">Cantidad*</label>
                    <input
                        id="quantity" type="number" name="quantity" title="Introduce una cantidad mayor que 0 y hasta 9999, con un máximo de 2 decimales (ej. 1.55)" placeholder="Número"
                        min={0.01} max={9999} step={0.01} inputMode="decimal" required
                        className={`${inputBase} ${inputColor.folly}`}
                    />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <label className={`${labelBase} text-center`} htmlFor="unit">Unidad*</label>
                    <input
                        id="unit" type="text" name="unit" title="Solo letras, espacios y tildes. Máximo 20 caracteres" placeholder="g, uds, ml..."
                        pattern="^\s*[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\s*$" maxLength={20} required
                        className={`${inputBase} ${inputColor.folly}`}
                    />
                </div>
            </div>

            <label className={labelBase} htmlFor="annotation">Anotación</label>
            <input
                id="annotation" type="text" name="annotation" title="Máximo 50 caracteres" maxLength={50}
                placeholder="¿Necesitas alguna aclaración?"
                className={`${inputBase} ${inputColor.folly} mb-2`}
            />

            <div className="flex flex-row items-center gap-2 pt-2">
                <label className={labelBase} htmlFor="main">¿Ingrediente principal?</label>
                <input id="main" type="checkbox" defaultChecked={true} name="main" className="size-4 accent-folly" />
            </div>

            <CircleButton type="submit" variant="saveRecipe" aria-label="Guardar" title="Guardar" className={`${btnColor.folly} mt-2`}>
                <MdSave aria-hidden="true" />
            </CircleButton>
        </form>
    )
}

export default NewIngredientForm
