import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ExpenseDashboard from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseDashboard />
  </StrictMode>,
)
