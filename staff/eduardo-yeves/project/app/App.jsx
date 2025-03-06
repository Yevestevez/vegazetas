import Landing from './view/Landing'
import Register from './view/Register'
import Login from './view/Login'
import Home from './view/Home'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App() {
    const navigate = useNavigate()
    const location = useLocation()

    let viewInPath = location.pathname.slice(1)
    if (viewInPath !== 'landing' && viewInPath !== 'register' && viewInPath !== 'login')
        viewInPath = 'landing'
    const [view, setView] = useState('landing')

    const handleLoginLinkClick = () => setView('login')
    const handleRegisterLinkClick = () => setView('register')

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
                navigate('/home')
                break
        }
    }, [view])

    console.log('App -> render')

    return <>
        <h1>HOLA APP!</h1>

        <Routes>
            <Route path="/landing" element={
                <Landing onLoginClicked={handleLoginLinkClick} onRegisterClicked={handleRegisterLinkClick} />
            } />

            <Route path="/register" element={
                <Register onLoginClicked={handleLoginLinkClick} />
            } />

            <Route path="/login" element={
                <Login onRegisterClicked={handleRegisterLinkClick} />
            } />

            <Route path="/" element={
                <Home />
            } />
        </Routes>
    </>
}

export default App