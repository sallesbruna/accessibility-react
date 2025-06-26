import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; // Deve conter os resets globais e font-family, etc.
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)