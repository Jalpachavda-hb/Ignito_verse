import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Global.css'
import App from './App.jsx'
import { initGlobalErrorLogging } from './services/errorLogService'

// Initialize global JS error logger for uncaught exceptions & promise rejections
initGlobalErrorLogging();

createRoot(document.getElementById('root')).render(
    <App />
)

