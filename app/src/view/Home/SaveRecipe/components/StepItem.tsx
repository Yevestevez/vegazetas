import { MdDelete, MdEdit, MdSave } from 'react-icons/md'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { IoMdCloseCircle } from 'react-icons/io'

import MiniCircleButton from '../../shared/MiniCircleButton'
import CircleButton from '../../../components/CircleButton'
import type { Step } from '../../../../types/recipe'

interface StepItemProps {
    step: Step
    index: number
    isEditing: boolean
    inputBase: string
    labelBase: string
    inputColor: Record<string, string>
    btnColor: Record<string, string>
    onEditToggle: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    onDelete: () => void
    onEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isFirst: boolean
    isLast: boolean
}

function StepItem({
    step,
    index,
    isEditing,
    inputBase,
    labelBase,
    inputColor,
    btnColor,
    onEditToggle,
    onMoveUp,
    onMoveDown,
    onDelete,
    onEditSubmit,
    isFirst,
    isLast
}: StepItemProps) {
    const stepButton = `text-xl sm:text-2xl interactive-lift cursor-pointer`

    return (
        <li className="flex flex-col text-center gap-2 break-inside-avoid" key={index}>
            <h3 className="anybody-logo text-lg sm:text-xl">{index + 1}</h3>

            {isEditing ? (
                <form
                    onSubmit={onEditSubmit}
                    className="flex flex-col items-center gap-4"
                >
                    <label className={labelBase} htmlFor={`text-${step.id}`}>Instrucciones*</label>
                    <textarea
                        id={`text-${step.id}`} name="text" defaultValue={step.text} title="Máximo 800 caracteres" required wrap="soft" maxLength={800}
                        placeholder="Añade las instrucciones del paso"
                        onInput={(e) => {
                            e.currentTarget.style.height = 'auto';
                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                        }}
                        className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight mb-2 py-2 px-3`}
                    />

                    <label className={labelBase} htmlFor={`note-${step.id}`}>Nota</label>
                    <textarea
                        id={`note-${step.id}`} name="note" defaultValue={step.note} title="Máximo 500 caracteres" wrap="soft" maxLength={500}
                        placeholder="¿Necesitas aclarar algo?"
                        onInput={(e) => {
                            e.currentTarget.style.height = 'auto';
                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                        }}
                        className={`${inputBase} ${inputColor.springBud} rounded-lg leading-tight mb-2 py-2 px-3`}
                    />

                    <label className={labelBase} htmlFor={`image-${step.id}`}>Imagen</label>
                    <input
                        id={`image-${step.id}`} name="image" type="url" defaultValue={step.image} title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg"
                        placeholder="Pega aquí la url de la imagen"
                        className={`${inputBase} ${inputColor.springBud} mb-2`}
                    />

                    <CircleButton type="submit" variant="saveRecipe" aria-label="Guardar" title="Guardar" className={`${btnColor.springBud} mt-2`}>
                        <MdSave aria-hidden="true" />
                    </CircleButton>
                </form>
            ) : (
                <>
                    <div className="text-sm sm:text-base leading-tight">
                        <strong>{step.text}</strong>
                    </div>
                    {step.note && (
                        <div className="italic text-xs sm:text-sm leading-tight">
                            {step.note}
                        </div>
                    )}
                    {step.image && (
                        <img
                            src={step.image}
                            alt={`Image ${index + 1}`}
                            className="my-2 sm:my-3 rounded-xs object-contain max-h-64 md:max-h-72 mx-auto shadow-hard-md xl:shadow-hard-lg"
                        />
                    )}
                </>
            )}

            <div className="flex flex-row mx-auto gap-4 mt-2">
                <button type="button" aria-label={isEditing ? "Cancelar" : "Editar paso"} title={isEditing ? "Cancelar" : "Editar paso"} onClick={onEditToggle} className={`${stepButton}`}>
                    {isEditing ? <IoMdCloseCircle aria-hidden="true" /> : <MdEdit aria-hidden="true" />}
                </button>

                <div className="flex flex-row  gap-2 rounded-full">
                    <button aria-label="Subir paso" title="Subir paso" onClick={onMoveUp} disabled={isFirst} className={`${stepButton} disabled:opacity-30 disabled:cursor-not-allowed`}>
                        <FaChevronUp aria-hidden="true" />
                    </button>

                    <button aria-label="Bajar paso" title="Bajar paso" onClick={onMoveDown} disabled={isLast} className={`${stepButton} disabled:opacity-30 disabled:cursor-not-allowed`}>
                        <FaChevronDown aria-hidden="true" />
                    </button>
                </div>

                <button type="button" aria-label="Eliminar paso" title="Eliminar paso" onClick={onDelete} className={`${stepButton}`}>
                    <MdDelete aria-hidden="true" />
                </button>
            </div>

            <div
                className="flex w-full my-4 border-t-2 border-spring-bud"
                aria-hidden="true"
            ></div>
        </li>
    )
}

export default StepItem
