import { createContext, useContext } from 'react'

interface AlertOptions {
    isWakingServer?: boolean
}

interface AppContextType {
    alert: (message: string, options?: AlertOptions) => () => void
    confirm: (message: string, callback: (result: boolean) => void) => void
}

const AppContext = createContext<AppContextType>({} as AppContextType)
const useAppContext = () => useContext(AppContext)

export {
    AppContext,
    useAppContext
}
