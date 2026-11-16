import { MdDelete, MdSave } from 'react-icons/md'

import MiniCircleButton from '../../common/MiniCircleButton'
import CircleButton from '../../../common/CircleButton'

interface TagSectionProps {
    tags: string[]
    onDeleteTag: (index: number) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    inputBase: string
    labelBase: string
    inputColor: Record<string, string>
    btnColor: Record<string, string>
}

function TagSection({
    tags,
    onDeleteTag,
    onSubmit,
    inputBase,
    labelBase,
    inputColor,
    btnColor
}: TagSectionProps) {
    return (
        <section aria-labelledby="tags-title" className="flex flex-col w-full mx-auto pt-2 pb-6 gap-4">
            <h3 id="tags-title" className={`mx-auto px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-sm shadow-hard-md xl:shadow-hard-lg text-folly bg-spring-bud`}>Etiquetas</h3>

            <ul className="flex flex-wrap w-full justify-center gap-x-4 md:gap-x-6 gap-y-2">
                {tags.map((tag: string, index: number) => (
                    <li className="flex flex-row items-center align-middle text-folly gap-2" key={index}>
                        <span className="
                                rounded-sm anybody-title text-xs sm:text-sm lg:text-base xl:text-lg pb-0.5 pt-1 px-2 bg-spring-bud shadow-hard-sm xs:shadow-hard-md
                            ">#{tag}</span>

                        <MiniCircleButton title="Eliminar etiqueta" aria-label="Eliminar etiqueta" onClick={(event) => onDeleteTag(index)} variant="recipe"><MdDelete aria-hidden="true" /></MiniCircleButton>
                    </li>
                ))}
            </ul>

            <form
                className="flex flex-col w-full max-w-2xl mx-auto items-center gap-2 md:gap-4 text-spring-bud pt-2" onSubmit={onSubmit}>

                <label className={labelBase} htmlFor="tag">Nueva etiqueta</label>
                <input
                    id="tag" type="text" name="tag" title="Solo letras minúsculas, números, guiones y guiones bajos. Sin espacios y máximo 30 caracteres" placeholder="Añade etiquetas a tu receta" pattern="^\s*[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ0-9\-_']{1,30}\s*$" maxLength={30} style={{ textTransform: 'lowercase' }}
                    className={`${inputBase} ${inputColor.springBud} placeholder:normal-case mb-2`}
                />

                <CircleButton type="submit" variant="saveRecipe" aria-label="Guardar" title="Guardar" className={`${btnColor.springBud} mt-2`}>
                    <MdSave aria-hidden="true" />
                </CircleButton>
            </form>
        </section>
    )
}

export default TagSection
