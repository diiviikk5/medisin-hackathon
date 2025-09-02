import React, { useState, useEffect, useRef } from 'react'
import alakhImage from '../assets/alakh_pandey.png'
import { useAchievements } from '../contexts/AchievementContext'

export function ThunderousMode() {
  const [active, setActive] = useState(false)
  const audioRef = useRef(null)
  const { trackThunderActivation } = useAchievements()

  // Simple effect - no external dependencies to cause loops
  useEffect(() => {
    if (active) {
      // TRACK ACHIEVEMENT WHEN THUNDER MODE ACTIVATES
      trackThunderActivation()

      // Add screen shake
      document.body.style.animation = 'screenShake 0.6s ease-in-out infinite'
      
      // Play audio
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.log('Audio autoplay prevented')
          })
        }
      }
    } else {
      // Clean up when closing
      document.body.style.animation = ''
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [active, trackThunderActivation]) // Added trackThunderActivation to dependencies

  // Audio ended handler
  const handleAudioEnd = () => {
    setActive(false)
  }

  // Close handler
  const closeThunder = () => {
    setActive(false)
  }

  // ESC key handler - separate useEffect to avoid conflicts
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && active) {
        setActive(false)
      }
    }
    
    if (active) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [active])

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={handleAudioEnd}
      >
        <source src="/alakh-sir-motivation.mp3" type="audio/mpeg" />
        <source src="/alakh-sir-motivation.wav" type="audio/wav" />
      </audio>

      {/* Thunder button */}
      {!active && (
        <button
          className="thunderous-button"
          onClick={() => setActive(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '100px',
            padding: '12px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          ALECC<br />DADDY
        </button>
      )}

      {/* Thunder overlay */}
      {active && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            animation: 'thunderShake 0.1s infinite'
          }}
          onClick={closeThunder}
        >
          {/* Lightning effects */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent, rgba(255, 255, 0, 0.1), transparent)',
              animation: 'lightning 0.5s infinite'
            }}
          />

          {/* Alakh image */}
          <img
            src={alakhImage}
            alt="Alakh Pandey"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '3px solid #f59e0b'
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Main text */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#f59e0b',
              textAlign: 'center',
              marginBottom: '10px',
              textShadow: '0 0 10px #f59e0b'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            ⚡ ALECC DADDY IS HERE ⚡
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '18px',
              color: '#fbbf24',
              textAlign: 'center',
              marginBottom: '30px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Physics Wallah Power Activated!
          </div>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeThunder()
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              fontSize: '30px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>

          {/* Instructions */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              textAlign: 'center',
              color: '#fbbf24',
              fontSize: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              "PADHLE BHAI!" ⚡
            </p>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>
              Click anywhere to close • Audio will auto-close when finished
            </p>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-5px, 0); }
          20%, 40%, 60%, 80% { transform: translate(5px, 0); }
        }

        @keyframes thunderShake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, -1px); }
          75% { transform: translate(1px, -1px); }
        }

        @keyframes lightning {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  )
}
