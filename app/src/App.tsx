import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

import logic from './logic'
import { SESSION_EXPIRED_EVENT } from './logic/authenticatedFetch'
import { AppContext } from './context'

import Alert from './view/common/Alert'
import Confirm from './view/common/Confirm'

import Landing from './view/Landing'
import Register from './view/Register'
import Login from './view/Login'
import Home from './view/Home'
import PasswordReset from './view/PasswordReset'

interface AlertMessage {
    text: string
    isWakingServer: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function App(): any {
    // @ts-expect-error - static property pattern for confirm callback
    App.confirmCallback = null
    const navigate = useNavigate()

    const handleUserRegistered = () => navigate('/login')
    const handleUserLoggedIn = () => navigate('/')
    const handleUserLoggedOut = useCallback(() => navigate('/login'), [navigate])
    const handlePasswordReseted = () => navigate('/login')

    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null)
    const [confirmMessage, setConfirmMessage] = useState('')

    const alert = useCallback((message: string, options: { isWakingServer?: boolean } = {}) => {
        setAlertMessage({
            text: message,
            isWakingServer: options.isWakingServer || false,
        })
        return () => setAlertMessage(null)
    }, [])

    useEffect(() => {
        const handleSessionExpired = () => {
            handleUserLoggedOut()
            alert('Tu sesión no es válida o ha caducado. Inicia sesión de nuevo.')
        }

        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }, [alert, handleUserLoggedOut])

    const confirm = (message: string, callback: (result: boolean) => void) => {
        setConfirmMessage(message)
        ;(App as any).confirmCallback = callback
    }

    const handleAcceptAlert = () => setAlertMessage(null)

    const handleAcceptConfirm = () => {
        const cb = (App as any).confirmCallback as ((result: boolean) => void) | null
        if (cb) {
            cb(true)
        }
        setConfirmMessage('')
        ;(App as any).confirmCallback = null
    }

    const handleCancelConfirm = () => {
        const cb = (App as any).confirmCallback as ((result: boolean) => void) | null
        if (cb) {
            cb(false)
        }
        setConfirmMessage('')
        ;(App as any).confirmCallback = null
    }

    return <AppContext.Provider value={{ alert, confirm }}>
        <Routes>
            <Route path="/" element={
                logic.isUserLoggedIn() ? <Navigate to="/menu" replace /> : <Navigate to="/landing" replace />
            } />

            <Route path="/landing" element={
                logic.isUserLoggedIn() ? <Navigate to="/" /> : <Landing />
            } />

            <Route path="/register" element={
                logic.isUserLoggedIn() ? <Navigate to="/" /> : <Register onUserRegistered={handleUserRegistered} />
            } />

            <Route path="/login" element={
                logic.isUserLoggedIn() ? <Navigate to="/" /> : <Login onUserLoggedIn={handleUserLoggedIn} />
            } />

            <Route path="/password-reset" element={
                <PasswordReset onPasswordReseted={handlePasswordReseted} />
            } />

            <Route path="/*" element={
                <Home onUserLoggedOut={handleUserLoggedOut} />
            } />
        </Routes>

        {alertMessage && (
            <Alert
                message={alertMessage.text}
                isWakingServer={alertMessage.isWakingServer}
                onAccept={handleAcceptAlert} />
        )}

        {confirmMessage && <Confirm message={confirmMessage} onAccept={handleAcceptConfirm} onCancel={handleCancelConfirm} />}
    </AppContext.Provider>
}

export default App

