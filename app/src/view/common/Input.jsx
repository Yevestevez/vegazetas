import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { useState } from 'react'

function Input({
    type = 'text',
    value,
    onChange,
    id,
    placeholder,
    pattern,
    title,
    className,
    theme = 'register',
    required = false,
    name,
    autoComplete,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordType = type === 'password'

    const themes = {
        register: {
            input: {
                bg: 'bg-sgbus-green',
                focusBg: 'focus:bg-canary',
                text: 'text-canary',
                focusText: 'focus:text-sgbus-green',
                focusOutline: 'focus:outline-sgbus-green'
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
                focusOutline: 'focus:outline-aquamarine'
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
                focusOutline: 'focus:outline-spring-bud'
            },
            icon: {
                text: 'text-folly',
                focusText: 'peer-focus:text-spring-bud',
                hover: 'hover:text-black'
            }
        }
    }

    const currentTheme = themes[theme]
    const inputType = isPasswordType && showPassword ? 'text' : type

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <div className={`relative w-full ${className}`}>
            <input
                className={`
                    peer flex items-center justify-center 
                    w-full h-12 xs:h-16 md:h-20 p-2 mb-2 xs:mb-4
                    min-w-0 truncate rounded-full
                    anybody text-center text-base xs:text-xl placeholder:italic placeholder:opacity-80
                    shadow-[0.6rem_0.6rem_0_rgba(0,0,0,0.8)] 
                    outline-none focus:outline-4 focus:outline-offset-0
                    transition-all duration-150 ease-out focus:scale-105
                    
                    ${currentTheme.input.bg} 
                    ${currentTheme.input.focusBg}
                    ${currentTheme.input.text} 
                    ${currentTheme.input.focusText}
                    ${currentTheme.input.focusOutline}   
                `}
                type={inputType}
                value={value}
                onChange={onChange}
                id={id}
                name={name}
                placeholder={placeholder}
                pattern={pattern}
                title={title}
                required={required}
                autoComplete={autoComplete}
                aria-required={required}
                aria-invalid={props['aria-invalid']}
                {...props}
            />

            {isPasswordType && (
                <button
                    type="button"
                    onClick={handleTogglePassword}
                    className={`
                        flex items-center justify-center absolute 
                        top-0 bottom-2 xs:bottom-4 my-auto right-4 xl:right-6 
                        size-8 xs:size-10 xl:size-12 p-1 
                        cursor-pointer rounded-full 
                        text-xl xs:text-3xl xl:text-4xl 
                        transform hover:scale-110 active:scale-95 
                        transition-all duration-150 ease-out 
                        focus:outline-2 focus:outline-offset-0 focus:outline-white 
                        
                        ${currentTheme.icon.text}
                        ${currentTheme.icon.focusText}
                        ${currentTheme.icon.hover}
             `}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showPassword}
                    aria-controls={id}
                >
                    {showPassword ? <IoMdEyeOff aria-hidden="true" /> : <IoMdEye aria-hidden="true" />}
                </button>
            )}
        </div>
    )
}

export default Input