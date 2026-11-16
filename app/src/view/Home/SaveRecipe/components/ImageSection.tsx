import { MdDelete, MdSave } from 'react-icons/md'

import MiniCircleButton from '../../common/MiniCircleButton'
import CircleButton from '../../../common/CircleButton'

interface ImageSectionProps {
    images: string[]
    onDeleteImage: (index: number) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    inputBase: string
    labelBase: string
    inputColor: Record<string, string>
    btnColor: Record<string, string>
}

function ImageSection({
    images,
    onDeleteImage,
    onSubmit,
    inputBase,
    labelBase,
    inputColor,
    btnColor
}: ImageSectionProps) {
    return (
        <section aria-labelledby="images-title" className="flex flex-col w-full mx-auto py-2 gap-4">
            <h3 id="images-title" className={`mx-auto px-2 py-0.5 mb-4 anybody-title text-base sm:text-lg xl:text-xl rounded-sm shadow-hard-md xl:shadow-hard-lg text-folly bg-spring-bud`}>Imágenes</h3>

            <ul className="flex gap-6 w-full justify-center">
                {images.map((image: string, index: number) => (
                    <li className="relative shadow-hard-md xl:shadow-hard-lg w-1/2" key={index}>
                        <MiniCircleButton onClick={(event) => onDeleteImage(index)} variant="recipe" className="absolute right-2 top-2"><MdDelete /></MiniCircleButton>
                        <img src={image} alt={`Image ${index}`} className="object-cover aspect-square h-full lg:max-h-96 w-full" />
                    </li>
                ))}
            </ul>

            <form className="flex flex-col w-full max-w-2xl mx-auto items-center gap-2 md:gap-4 text-spring-bud" onSubmit={onSubmit}>
                <label className={labelBase} htmlFor="image">URL de imagen</label>
                <input
                    id="image" type="url" name="image" title="Pega la URL de la imagen. Ejemplo: https://recetas.es/pizza.jpg (Máximo 2 imágenes)"
                    placeholder="Pega aquí la URL de la imagen"
                    className={`${inputBase} ${inputColor.springBud} truncate`}
                />

                <CircleButton type="submit" variant="saveRecipe" aria-label="Guardar" title="Guardar" className={`${btnColor.springBud} mt-4`}>
                    <MdSave aria-hidden="true" />
                </CircleButton>
            </form>
        </section>
    )
}

export default ImageSection
