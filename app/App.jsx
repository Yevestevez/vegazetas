import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'

import logic from './logic'

import Landing from './view/Landing'
import Register from './view/Register'
import Login from './view/Login'
import Home from './view/Home'
import PasswordReset from './view/PasswordReset'

import Alert from './view/common/Alert'
import Confirm from './view/common/Confirm'
import { AppContext } from './context'

function App() {
    const navigate = useNavigate()
    const location = useLocation()

    let viewInPath = location.pathname.slice(1)
    if (viewInPath !== 'landing' && viewInPath !== 'register' && viewInPath !== 'login' && viewInPath !== 'my-recipes' && !viewInPath.startsWith('password-reset') && !viewInPath.startsWith('create-recipe') && !viewInPath.startsWith('update-recipe') && !viewInPath.startsWith('recipe'))
        viewInPath = 'landing'
    const [view, setView] = useState(viewInPath)

    const handleLoginLinkClick = () => setView('login')
    const handleRegisterLinkClick = () => setView('register')
    const handleUserRegistered = () => setView('login')
    const handleUserLoggedIn = () => setView('home')
    const handleUserLoggedOut = () => setView('login')
    const handlePasswordReseted = () => setView('login')

    // alert y confirm
    const [alertMessage, setAlertMessage] = useState('')
    const [confirmMessage, setConfirmMessage] = useState('')
    const alert = message => {
        setAlertMessage(message)
        return () => setAlertMessage('')
    }
    const confirm = (message, callback) => {
        setConfirmMessage(message)
        App.confirmCallback = callback
    }
    const handleAcceptAlert = () => setAlertMessage('')
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

    useEffect(() => {
        switch (view) {
            case 'landing':
                navigate('/landing')
                break
            case 'register':
                navigate('/register')
                break
            case 'login':
                navigate('/login')
                break
            case 'home':
                navigate('/')
                break
            case 'password-reset':
                navigate('/password-reset/:token')
                break
        }
    }, [view])

    console.log('App -> render')

    return <AppContext.Provider value={{ alert, confirm }}>
        <Routes>
            <Route path="/landing" element={
                logic.isUserLoggedIn() ? <Navigate to="/" /> : <Landing onLoginClicked={handleLoginLinkClick} onRegisterClicked={handleRegisterLinkClick} />
            } />

            <Route path="/register" element={
                logic.isUserLoggedIn() ? <Navigate to="/" /> : <Register onLoginClicked={handleLoginLinkClick} onUserRegistered={handleUserRegistered} />
            } />

            <Route path="/login" element={
                logic.isUserLoggedIn() ? <Navigate to="/" /> : <Login onRegisterClicked={handleRegisterLinkClick} onUserLoggedIn={handleUserLoggedIn} />
            } />

            <Route path="/password-reset/:token" element={
                <PasswordReset onPasswordReseted={handlePasswordReseted} />
            } />

            <Route path="/*" element={
                <Home onUserLoggedOut={handleUserLoggedOut} />
            } />
        </Routes>

        {alertMessage && <Alert message={alertMessage} onAccept={handleAcceptAlert} />}
        {confirmMessage && <Confirm message={confirmMessage} onAccept={handleAcceptConfirm} onCancel={handleCancelConfirm} />}
    </AppContext.Provider >
}

export default App