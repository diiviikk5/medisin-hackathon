import React, { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('ph-theme')
    // Also toggle on html for full coverage
    document.documentElement.classList.toggle('ph-theme')
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '160px',
        right: '140px',
        zIndex: 1000,
        background: isDarkMode ? 
          'linear-gradient(45deg, #FF6600, #FF4500)' : 
          'linear-gradient(45deg, #3b82f6, #8b5cf6)',
        color: 'white',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: isDarkMode ? 
          '0 4px 15px rgba(255, 102, 0, 0.3)' :
          '0 4px 15px rgba(59, 130, 246, 0.3)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {isDarkMode ? '🧡' : '☀️'}
      {isDarkMode ? 'Hub Mode' : 'Light Mode'}
    </button>
  )
}
