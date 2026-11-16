import { MdSave } from 'react-icons/md'

import CircleButton from '../../../common/CircleButton'

interface BasicDataFormProps {
    title: string
    description: string
    time: number | undefined
    difficulty: string
    onDifficultyChange: (value: string) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    inputBase: string
    labelBase: string
    inputColor: Record<string, string>
    btnColor: Record<string, string>
}

function BasicDataForm({
    title,
    description,
    time,
    difficulty,
    onDifficultyChange,
    onSubmit,
    inputBase,
    labelBase,
    inputColor,
    btnColor
}: BasicDataFormProps) {
    return (
        <section aria-labelledby="basic-data-title" className="flex flex-col w-full items-center text-center py-2 gap-2">
            <h3 id="basic-data-title" className={`mx-auto px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-xs shadow-hard-md xl:shadow-hard-lg text-folly bg-spring-bud`}>Datos básicos</h3>

            <form className="flex flex-col w-full max-w-2xl mx-auto items-center gap-2 md:gap-4 text-spring-bud" onSubmit={onSubmit}>

                <label className={labelBase} htmlFor="title">Título*</label>
                <input
                    id="title" type="text" name="title" required
                    placeholder="Pon un título a tu receta"
                    defaultValue={title} maxLength={50}
                    title="Campo obligatorio. Máximo 50 caracteres"
                    className={`${inputBase} ${inputColor.springBud} mb-2 truncate`}
                />

                <label className={labelBase} htmlFor="description">Descripción</label>
                <textarea
                    id="description" name="description" title="Máximo 500 caracteres" placeholder="Describe tu receta ¡cuéntanos más!"
                    defaultValue={description} maxLength={500} wrap="soft"
                    onInput={(e) => {
                        e.currentTarget.style.height = 'auto';
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                    className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight mb-2 px-3 `}
                />

                <div className="flex flex-row w-full justify-between gap-4">
                    <div className="flex flex-col w-full gap-2">
                        <label className={labelBase} htmlFor="time">Tiempo (min)</label>
                        <input
                            id="time" type="number" name="time" title="Introduce un número entero entre 5 y 9999 minutos"
                            placeholder="En minutos" defaultValue={time === 0 ? '' : (time ?? '')} min={5} max={9999} step={1}
                            className={`${inputBase} ${inputColor.springBud} truncate mb-2`}
                        />
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <label className={labelBase} htmlFor="difficulty">Dificultad</label>
                        <select
                            id="difficulty" name="difficulty" value={difficulty}
                            onChange={(e) => onDifficultyChange(e.target.value)}
                            className={`${inputBase} ${inputColor.springBud} text-center px-0 mb-2`}
                        >
                            <option value="">- Selecciona -</option>
                            <option value="easy">Fácil</option>
                            <option value="medium">Media</option>
                            <option value="difficult">Difícil</option>
                        </select>
                    </div>
                </div>

                <CircleButton type="submit" variant="saveRecipe" title="Guardar" aria-label="Guardar" className={`${btnColor.springBud} mt-2`}>
                    <MdSave aria-hidden="true" />
                </CircleButton>
            </form>
        </section>
    )
}

export default BasicDataForm
