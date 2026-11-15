import { useCallback, useEffect, useRef, useState } from 'react'
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

function App() {
    const confirmCallbackRef = useRef<((result: boolean) => void) | null>(null)
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
        confirmCallbackRef.current = callback
    }

    const handleAcceptAlert = () => setAlertMessage(null)

    const handleAcceptConfirm = () => {
        confirmCallbackRef.current?.(true)
        setConfirmMessage('')
        confirmCallbackRef.current = null
    }

    const handleCancelConfirm = () => {
        confirmCallbackRef.current?.(false)
        setConfirmMessage('')
        confirmCallbackRef.current = null
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

