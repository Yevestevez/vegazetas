import {IoMdEye ,IoMdEyeOff} from 'react-icons/io'
import { useState } from 'react'

function PasswordInput({
                           value,
                           onChange,
                           id,
                           placeholder,
                           pattern,
                           title,
                           className,
                           theme = 'register' // tema por defecto
                       }) {
    const [showPassword, setShowPassword] = useState(false)

    const themes = {
        register: {
            input: {
                bg: 'bg-sgbus-green',
                focusBg: 'focus:bg-canary',
                text: 'text-canary',
                focusText: 'focus:text-sgbus-green',
                outline: 'outline-sgbus-green'
            },
            icon: {
                text: 'text-canary',
                focusText: 'peer-focus:text-sgbus-green',
                hover: 'hover:text-violet'
            }
        },
        login: {
            input: {
                bg: 'bg-aquamarine',
                focusBg: 'focus:bg-violet',
                text: 'text-violet',
                focusText: 'focus:text-aquamarine',
                outline: 'outline-aquamarine'
            },
            icon: {
                text: 'text-violet',
                focusText: 'peer-focus:text-aquamarine',
                hover: 'hover:text-hot-magenta'
            }
        },
        passwordReset: {
            input: {
                bg: 'bg-spring-bud',
                focusBg: 'focus:bg-folly',
                text: 'text-folly',
                focusText: 'focus:text-spring-bud',
                outline: 'outline-spring-bud'
            },
            icon: {
                text: 'text-folly',
                focusText: 'peer-focus:text-spring-bud',
                hover: 'hover:text-spring-bud'
            }
        }
    }

    const currentTheme = themes[theme]

    return (
        <div className={`relative ${className}`}>
            <input
                className={`
                    peer
                    /* Layout y tamaño base */
                    flex items-center justify-center rounded-full
                    p-[4vw] xl:p-[2vw] mb-[2vw]
                    pr-[12vw] xl:pr-[6vw]
                    w-full h-[14vw] sm:h-[12vw] lg:h-[10vw] xl:h-[4vw]

                    /* Colores del tema */
                    ${currentTheme.input.bg} 
                    ${currentTheme.input.focusBg}
                    ${currentTheme.input.text} 
                    ${currentTheme.input.focusText}
                    ${currentTheme.input.outline}
                    focus:outline-5

                    /* Estilos base */
                    anybody text-center text-[4.5vw] sm:text-[3.8vw] lg:text-[3.5vw] xl:text-[2vw]
                    min-w-0 truncate placeholder:italic
                    drop-shadow-[1.6vw_1.6vw_0_rgba(0,0,0,0.8)]
                    md:drop-shadow-[1.2vw_1.2vw_0_rgba(0,0,0,0.8)]
                    lg:drop-shadow-[1vw_1vw_0_rgba(0,0,0,0.8)]
                    xl:drop-shadow-[0.8vw_0.8vw_0_rgba(0,0,0,0.8)]
                `}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                id={id}
                placeholder={placeholder}
                pattern={pattern}
                title={title}
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className={`
                    /* Layout base */
                    absolute right-[6vw] xl:right-[3vw] top-1/2
                    -translate-y-1/2 -mt-[0.5vw]
                    w-[6vw] xl:w-[2vw] h-[6vw] xl:h-[2vw]
                    text-[8vw] xl:text-[6vw]
                    flex items-center justify-center

                    /* Colores del tema */
                    ${currentTheme.icon.text}
                    ${currentTheme.icon.focusText}
                    ${currentTheme.icon.hover}
                    transition-colors duration-200
                `}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
        </div>
    )
}


export default PasswordInput