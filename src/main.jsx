import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// When SW deploys a new version, old chunks no longer exist — reload to get the new build
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
