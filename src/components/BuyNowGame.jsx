import React, { useState, useEffect, useRef } from 'react'

export function BuyNowGame({ onClose, productName, onResult }) {
  const [gameState, setGameState] = useState('choosing')
  const [userChoice, setUserChoice] = useState(null)
  const [tickPosition, setTickPosition] = useState({ x: 300, y: 100 })
  const [result, setResult] = useState(null)
  
  const velocityRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef(null)
  const isAnimating = useRef(false)
  const bounceCount = useRef(0)

  // Game dimensions
  const GAME_WIDTH = 600
  const GAME_HEIGHT = 500

  const handleChoice = (choice) => {
    setUserChoice(choice)
    
    setTimeout(() => {
      setGameState('playing')
      setTickPosition({ x: GAME_WIDTH / 2, y: 100 })
      bounceCount.current = 0
      
      // Completely random starting velocity - no bias
      velocityRef.current = { 
        x: (Math.random() - 0.5) * 8, // Random left/right 
        y: 1.2 // Downward
      }
      
      startPongAnimation()
    }, 800)
  }

  const startPongAnimation = () => {
    isAnimating.current = true
    
    const animate = () => {
      if (!isAnimating.current) return

      setTickPosition(prevPos => {
        let newX = prevPos.x + velocityRef.current.x
        let newY = prevPos.y + velocityRef.current.y

        // Random bounce chance on left wall (50%)
        if (newX <= 30) {
          if (Math.random() < 0.6) { // 60% chance to bounce
            newX = 30
            velocityRef.current.x = Math.abs(velocityRef.current.x) * (0.8 + Math.random() * 0.4)
            bounceCount.current++
          }
        }
        
        // Random bounce chance on right wall (50%)
        if (newX >= GAME_WIDTH - 30) {
          if (Math.random() < 0.6) { // 60% chance to bounce
            newX = GAME_WIDTH - 30
            velocityRef.current.x = -Math.abs(velocityRef.current.x) * (0.8 + Math.random() * 0.4)
            bounceCount.current++
          }
        }

        // Top bounce (30% chance)
        if (newY <= 30 && Math.random() < 0.3) {
          newY = 30
          velocityRef.current = { 
            x: velocityRef.current.x + (Math.random() - 0.5) * 3,
            y: Math.abs(velocityRef.current.y)
          }
          bounceCount.current++
        }

        // Gravity
        velocityRef.current.y += 0.06

        // Check if reached bottom
        if (newY >= GAME_HEIGHT - 120) {
          isAnimating.current = false
          if (animationRef.current) cancelAnimationFrame(animationRef.current)

          // TRUE 50/50 - final position determines result
          const won = newX < GAME_WIDTH / 2

          setResult(won)
          setGameState('finished')

          setTimeout(() => {
            if (onResult) onResult(won)
          }, 3000)

          return { x: newX, y: GAME_HEIGHT - 120 }
        }

        return { x: newX, y: newY }
      })

      setTimeout(() => {
        if (isAnimating.current) animationRef.current = requestAnimationFrame(animate)
      }, 25)
    }

    animate()
  }

  useEffect(() => {
    return () => {
      isAnimating.current = false
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const getSymbol = () => userChoice === 'yes' ? '✓' : '✗'
  const getColor = () => userChoice === 'yes' ? '#22c55e' : '#ef4444'

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'transparent',
          border: '2px solid #ef4444',
          color: '#ef4444',
          fontSize: 24,
          fontWeight: 'bold',
          width: 40,
          height: 40,
          borderRadius: '50%',
          cursor: 'pointer'
        }}
      >
        ×
      </button>

      {/* Title */}
      <h2 style={{
        color: '#bfdbfe',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold'
      }}>
        Can you successfully add "{productName}" to cart?
      </h2>

      <p style={{
        color: '#94a3b8',
        marginBottom: 40,
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic'
      }}>
        Choose your preference, but fate decides with 50/50 odds!
      </p>

      {/* CHOOSING STATE */}
      {gameState === 'choosing' && (
        <div style={{
          display: 'flex',
          gap: 80,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* YES Choice */}
          <div
            onClick={() => handleChoice('yes')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '20px',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.border = '2px solid #22c55e'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.border = '2px solid transparent'
            }}
          >
            <div style={{
              width: 120,
              height: 120,
              border: '4px solid #22c55e',
              borderRadius: 20,
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(34, 197, 94, 0.4)',
              marginBottom: '15px'
            }}>
              <span style={{
                color: '#22c55e',
                fontSize: 60,
                fontWeight: 'bold'
              }}>
                ✓
              </span>
            </div>
            <span style={{
              color: '#22c55e',
              fontSize: 28,
              fontWeight: 'bold'
            }}>
              YES
            </span>
          </div>

          {/* NO Choice */}
          <div
            onClick={() => handleChoice('no')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '20px',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.border = '2px solid #ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.border = '2px solid transparent'
            }}
          >
            <div style={{
              width: 120,
              height: 120,
              border: '4px solid #ef4444',
              borderRadius: 20,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
              marginBottom: '15px'
            }}>
              <span style={{
                color: '#ef4444',
                fontSize: 60,
                fontWeight: 'bold'
              }}>
                ✗
              </span>
            </div>
            <span style={{
              color: '#ef4444',
              fontSize: 28,
              fontWeight: 'bold'
            }}>
              NO
            </span>
          </div>
        </div>
      )}

      {/* PLAYING & FINISHED STATES */}
      {(gameState === 'playing' || gameState === 'finished') && (
        <div>
          {/* Game Arena */}
          <div style={{
            position: 'relative',
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            border: '4px solid #3b82f6',
            borderRadius: 20,
            boxShadow: '0 0 40px #2563eb',
            overflow: 'hidden',
            marginBottom: gameState === 'finished' ? 30 : 0
          }}>
            {/* Bouncing Symbol */}
            <div style={{
              position: 'absolute',
              left: tickPosition.x - 25,
              top: tickPosition.y - 25,
              width: 50,
              height: 50,
              color: getColor(),
              fontSize: 35,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: `0 0 20px ${getColor()}`,
              filter: `drop-shadow(0 0 15px ${getColor()})`,
              zIndex: 10,
              border: `3px solid ${getColor()}`,
              borderRadius: '50%',
              backgroundColor: `${getColor()}30`,
              animation: gameState === 'playing' ? 'bounce 0.3s ease-in-out infinite alternate' : 'none'
            }}>
              {getSymbol()}
            </div>

            {/* YES Zone (Left) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '50%',
              height: 120,
              backgroundColor: result === true ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.3)',
              border: '4px solid #22c55e',
              borderBottom: 'none',
              borderRight: '2px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22c55e',
              fontSize: 42,
              fontWeight: 'bold',
              textShadow: '0 0 20px #22c55e',
              animation: result === true ? 'winner 2s ease-in-out infinite' : 'none'
            }}>
              YES ✓
            </div>

            {/* NO Zone (Right) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '50%',
              height: 120,
              backgroundColor: result === false ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.3)',
              border: '4px solid #ef4444',
              borderBottom: 'none',
              borderLeft: '2px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              fontSize: 42,
              fontWeight: 'bold',
              textShadow: '0 0 20px #ef4444',
              animation: result === false ? 'winner 2s ease-in-out infinite' : 'none'
            }}>
              NO ✗
            </div>

            {/* Center Line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 120,
              width: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }} />

            {/* Bounce Counter */}
            {gameState === 'playing' && (
              <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#bfdbfe',
                fontSize: 18,
                fontWeight: 'bold',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '10px 20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                Bounces: {bounceCount.current} 🎾
              </div>
            )}
          </div>

          {/* Result Message */}
          {gameState === 'finished' && (
            <div style={{
              padding: 30,
              backgroundColor: result ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: result ? '4px solid #22c55e' : '4px solid #ef4444',
              borderRadius: 20,
              textAlign: 'center',
              maxWidth: 600,
              boxShadow: result ? 
                '0 0 30px rgba(34, 197, 94, 0.4)' : 
                '0 0 30px rgba(239, 68, 68, 0.4)'
            }}>
              <h3 style={{
                color: result ? '#22c55e' : '#ef4444',
                fontSize: 36,
                fontWeight: 'bold',
                margin: 0,
                textShadow: result ? '0 0 15px #22c55e' : '0 0 15px #ef4444'
              }}>
                {result ? '🎉 Congratulations!' : '💔 Better Luck Next Time!'}
              </h3>
              <p style={{
                color: result ? '#86efac' : '#fca5a5',
                fontSize: 22,
                margin: '20px 0 5px 0',
                fontWeight: '600'
              }}>
                {result ? 
                  'Item successfully added to cart!' : 
                  'Item will be removed from cart.'}
              </p>
              <div style={{
                color: '#94a3b8',
                fontSize: 16,
                margin: '15px 0 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Your choice: <strong>{userChoice?.toUpperCase()}</strong> {getSymbol()}</span>
                <span>Result: <strong>{result ? 'YES' : 'NO'}</strong></span>
                <span>Bounces: <strong>{bounceCount.current}</strong> 🎾</span>
              </div>
              <p style={{
                color: '#64748b',
                fontSize: 14,
                margin: '10px 0 0 0',
                fontStyle: 'italic'
              }}>
                {userChoice === (result ? 'yes' : 'no') ? 
                  '🍀 Lucky! Your choice matched the random outcome!' : 
                  '🎲 Unlucky! Random outcome was different from your choice.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes winner {
          0%, 100% { box-shadow: inset 0 0 20px rgba(255,255,255,0.1); }
          50% { box-shadow: inset 0 0 40px rgba(255,255,255,0.3); }
        }
      `}</style>
    </div>
  )
}
