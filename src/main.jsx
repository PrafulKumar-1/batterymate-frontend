// Line 1-3: React and DOM imports
import React from 'react'
import ReactDOM from 'react-dom/client'

// Line 4-5: App component and global styles
import App from './App'
import './styles/globals.css'

// Line 6-12: Create root and render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
