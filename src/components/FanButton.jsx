import React, { useState, useEffect, useRef } from 'react'

export function FanButton() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [virtualMousePos, setVirtualMousePos] = useState({ x: 0, y: 0 })
  const [isInWindZone, setIsInWindZone] = useState(false)
  const [fanSpeed, setFanSpeed] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [windParticles, setWindParticles] = useState([])
  const buttonRef = useRef(null)
  const containerRef = useRef(null)
  const windIntervalRef = useRef(null)

  // Track real mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      const realPos = { x: e.clientX, y: e.clientY }
      setMousePos(realPos)
      
      if (!isInWindZone) {
        setVirtualMousePos(realPos)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isInWindZone])

  // Wind zone detection and mouse blow-away effect
  useEffect(() => {
    if (!buttonRef.current || !containerRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    
    // Define wind zone (large area around button)
    const windZone = {
      left: buttonRect.left - 300,
      right: buttonRect.right + 100,
      top: buttonRect.top - 150,
      bottom: buttonRect.bottom + 50
    }

    const isInWind = mousePos.x >= windZone.left && 
                     mousePos.x <= windZone.right && 
                     mousePos.y >= windZone.top && 
                     mousePos.y <= windZone.bottom

    if (isInWind && !isInWindZone) {
      setIsInWindZone(true)
      setAttempts(prev => prev + 1)
      
      // Start wind effect
      windIntervalRef.current = setInterval(() => {
        blowMouseAway(buttonRect, windZone)
        generateWindParticles(buttonRect)
      }, 16) // 60fps
      
    } else if (!isInWind && isInWindZone) {
      setIsInWindZone(false)
      clearInterval(windIntervalRef.current)
      setWindParticles([])
    }

    // Set fan speed based on proximity
    if (isInWind) {
      const centerX = buttonRect.left + buttonRect.width / 2
      const centerY = buttonRect.top + buttonRect.height / 2
      const distance = Math.sqrt(
        Math.pow(mousePos.x - centerX, 2) + 
        Math.pow(mousePos.y - centerY, 2)
      )
      setFanSpeed(Math.max(1, Math.min(10, (300 - distance) / 30)))
    } else {
      setFanSpeed(0)
    }

  }, [mousePos, isInWindZone])

  const blowMouseAway = (buttonRect, windZone) => {
    const fanCenterX = buttonRect.right + 80
    const fanCenterY = buttonRect.top + buttonRect.height / 2

    // Calculate wind direction (from fan to left)
    const windDirectionX = -1 // Always blow left
    const windDirectionY = (Math.random() - 0.5) * 0.3 // Slight vertical variation

    // Calculate how far mouse should be blown
    const windStrength = 15
    const targetX = mousePos.x + (windDirectionX * windStrength)
    const targetY = mousePos.y + (windDirectionY * windStrength)

    // Keep virtual mouse outside the wind zone
    const newVirtualX = Math.min(windZone.left - 50, targetX)
    const newVirtualY = Math.max(windZone.top - 20, Math.min(windZone.bottom + 20, targetY))

    setVirtualMousePos({
      x: Math.max(0, Math.min(window.innerWidth, newVirtualX)),
      y: Math.max(0, Math.min(window.innerHeight, newVirtualY))
    })
  }

  const generateWindParticles = (buttonRect) => {
    const fanX = buttonRect.right + 80
    const fanY = buttonRect.top + buttonRect.height / 2

    setWindParticles(prev => {
      const newParticles = []
      
      // Add new particles
      for (let i = 0; i < 3; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: fanX + Math.random() * 20,
          y: fanY + (Math.random() - 0.5) * 60,
          life: 1.0,
          speedX: -8 - Math.random() * 4,
          speedY: (Math.random() - 0.5) * 2
        })
      }

      // Update existing particles
      const updatedParticles = prev
        .filter(p => p.life > 0)
        .map(p => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          life: p.life - 0.02
        }))

      return [...updatedParticles, ...newParticles].slice(0, 50)
    })
  }

  const handleButtonClick = () => {
    if (attempts >= 15) {
      alert('🏳️ Fine! You\'ve earned it through sheer determination! 🏆\n\nContact: contact@medisin.com\nPhone: 1-800-MEDISIN\nEmail: help@medisin.com')
    } else {
      alert(`🌪️ Nice try! The wind is too strong! \n\nAttempts: ${attempts}/15\n\nKeep trying, brave soul! 💨`)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (windIntervalRef.current) {
        clearInterval(windIntervalRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        padding: '80px 20px',
        backgroundColor: '#f1f5f9',
        minHeight: '500px',
        overflow: 'hidden',
        borderTop: '1px solid #e2e8f0'
      }}
    >
      {/* Virtual Mouse Pointer */}
      {isInWindZone && (
        <div style={{
          position: 'fixed',
          left: virtualMousePos.x,
          top: virtualMousePos.y,
          width: '20px',
          height: '20px',
          background: 'black',
          clipPath: 'polygon(0 0, 0 20px, 7px 15px, 12px 20px, 20px 12px, 15px 7px, 20px 0)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'all 0.1s ease-out',
          transform: 'rotate(-15deg)',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }} />
      )}

      {/* Wind Particles */}
      {windParticles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: '6px',
            height: '6px',
            backgroundColor: `rgba(59, 130, 246, ${particle.life})`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 100
          }}
        />
      ))}

      {/* Fan Visual */}
      <div style={{
        position: 'absolute',
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Fan Blades */}
        <div style={{
          width: '80px',
          height: '80px',
          position: 'relative',
          animation: isInWindZone ? `spin ${0.1 + (11 - fanSpeed) * 0.1}s linear infinite` : 'none'
        }}>
          {/* Fan Blades */}
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <div
              key={angle}
              style={{
                position: 'absolute',
                width: '35px',
                height: '8px',
                backgroundColor: '#64748b',
                borderRadius: '4px',
                top: '50%',
                left: '50%',
                transformOrigin: 'left center',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(20px)`
              }}
            />
          ))}
          {/* Fan Center */}
          <div style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundColor: '#475569',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }} />
        </div>

        {/* Fan Base */}
        <div style={{
          width: '12px',
          height: '60px',
          backgroundColor: '#374151',
          borderRadius: '6px'
        }} />
        <div style={{
          width: '30px',
          height: '8px',
          backgroundColor: '#374151',
          borderRadius: '4px'
        }} />
      </div>

      {/* Animated Wind Lines */}
      {isInWindZone && (
        <div style={{
          position: 'absolute',
          right: '120px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                height: '3px',
                backgroundColor: `rgba(59, 130, 246, ${0.8 - i * 0.1})`,
                borderRadius: '2px',
                animation: `windFlow${i % 3} 0.4s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                width: `${60 - i * 5}px`
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '20px'
        }}>
          🌪️ Contact Challenge! 🌪️
        </h2>

        <p style={{
          fontSize: '20px',
          color: '#64748b',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Can you overcome the mighty desk fan? Our contact button is just ahead!
          {attempts > 0 && attempts < 5 && (
            <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
              🌀 Feeling a bit windy, isn't it? ({attempts} attempts)
            </span>
          )}
          {attempts >= 5 && attempts < 10 && (
            <span style={{ color: '#f59e0b', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
              💨 This fan is no joke! Keep fighting! ({attempts} attempts)
            </span>
          )}
          {attempts >= 10 && attempts < 15 && (
            <span style={{ color: '#8b5cf6', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
              ⚡ You're getting closer! The fan is weakening! ({attempts} attempts)
            </span>
          )}
          {attempts >= 15 && (
            <span style={{ color: '#22c55e', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
              🏆 Victory is within reach! Click now! ({attempts} attempts)
            </span>
          )}
        </p>

        {/* The Impossible Button */}
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '20px 40px',
            fontSize: '24px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '12px',
            cursor: attempts >= 15 ? 'pointer' : 'not-allowed',
            boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: attempts >= 15 ? 1000 : 1,
            opacity: attempts >= 15 ? 1 : 0.9,
            transform: isInWindZone && attempts < 15 ? 'translateX(10px) rotate(2deg)' : 'none'
          }}
        >
          Contact Us! 📧
          {isInWindZone && attempts < 15 && (
            <span style={{
              position: 'absolute',
              bottom: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              animation: 'bounce 1s ease-in-out infinite'
            }}>
              🌪️ Too windy! Try harder!
            </span>
          )}
        </button>

        {/* Instructions */}
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          marginTop: '30px',
          fontStyle: 'italic'
        }}>
          💡 Tip: Maybe if you approach from a different angle... or just be really, really persistent!
        </p>

        {/* Attempt Counter */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: attempts >= 15 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0,0,0,0.1)',
          padding: '12px 20px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: attempts >= 15 ? '#22c55e' : '#64748b',
          border: attempts >= 15 ? '2px solid #22c55e' : 'none'
        }}>
          {attempts >= 15 ? '🏆 VICTORY!' : `💨 Wind Resistance: ${attempts}/15`}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes windFlow0 {
          0%, 100% { opacity: 0.3; transform: translateX(0); width: 60px; }
          50% { opacity: 0.8; transform: translateX(-30px); width: 40px; }
        }
        
        @keyframes windFlow1 {
          0%, 100% { opacity: 0.4; transform: translateX(0); width: 55px; }
          50% { opacity: 0.9; transform: translateX(-35px); width: 35px; }
        }
        
        @keyframes windFlow2 {
          0%, 100% { opacity: 0.2; transform: translateX(0); width: 50px; }
          50% { opacity: 0.7; transform: translateX(-25px); width: 30px; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
