import Landing from './view/Landing'
import Register from './view/Register'
import Login from './view/Login'
import Home from './view/Home'

import logic from './logic'

import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App() {
    const navigate = useNavigate()
    const location = useLocation()

    let viewInPath = location.pathname.slice(1)
    if (viewInPath !== 'landing' && viewInPath !== 'register' && viewInPath !== 'login' && viewInPath !== 'my-recipes' && !viewInPath.startsWith('create-recipe') && !viewInPath.startsWith('recipe'))
        viewInPath = 'landing'
    const [view, setView] = useState(viewInPath)

    const handleLoginLinkClick = () => setView('login')

    const handleRegisterLinkClick = () => setView('register')

    const handleUserRegistered = () => setView('login')

    const handleUserLoggedIn = () => setView('home')

    const handleUserLoggedOut = () => setView('login')

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
        }
    }, [view])

    console.log('App -> render')

    return <>
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

            <Route path="/*" element={
                <Home onUserLoggedOut={handleUserLoggedOut} />
            } />
        </Routes>
    </>
}

export default App