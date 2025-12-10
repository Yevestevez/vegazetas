import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

import logic from './logic'
import { AppContext } from './context'

import Alert from './view/common/Alert'
import Confirm from './view/common/Confirm'

import Landing from './view/Landing'
import Register from './view/Register'
import Login from './view/Login'
import Home from './view/Home'
import PasswordReset from './view/PasswordReset'

function App() {
    const navigate = useNavigate()

    const handleUserRegistered = () => navigate('/login')
    const handleUserLoggedIn = () => navigate('/')
    const handleUserLoggedOut = () => navigate('/login')
    const handlePasswordReseted = () => navigate('/login')

    // alert y confirm
    const [alertMessage, setAlertMessage] = useState(null)
    const [confirmMessage, setConfirmMessage] = useState('')
    const alert = (message, options = {}) => {
        setAlertMessage({
            text: message,
            isWakingServer: options.isWakingServer || false,
        })
        return () => setAlertMessage(null)
    }
    const confirm = (message, callback) => {
        setConfirmMessage(message)
        App.confirmCallback = callback
    }
    const handleAcceptAlert = () => setAlertMessage(null)
    const handleAcceptConfirm = () => {
        App.confirmCallback(true)

        setConfirmMessage('')

        App.confirmCallback = null
    }
    const handleCancelConfirm = () => {
        App.confirmCallback(false)

        setConfirmMessage('')

        App.confirmCallback = null
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
    </AppContext.Provider >
}

export default App