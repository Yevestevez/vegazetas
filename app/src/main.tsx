import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

// @ts-ignore - Vite handles CSS side-effect imports
import './main.css'

import App from './App'

createRoot(document.getElementById('root')!).render(
    <Router>
        <App />
    </Router>
)
