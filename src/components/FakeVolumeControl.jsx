import React, { useState, useEffect, useRef } from 'react'
import { useAchievements } from '../contexts/AchievementContext'

export function FakeVolumeControl() {
  const [volume, setVolume] = useState(35)
  const [dragPosition, setDragPosition] = useState(20)
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState(0)
  const intervalRef = useRef(null)
  const dragRef = useRef(null)
  const { trackVolumeAdjustment } = useAchievements()

  // Volume decreases over time - BUT ONLY WHEN NOT DRAGGING
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Only decrease if NOT currently dragging
      if (!isDragging) {
        setVolume(prev => {
          if (prev > 0) {
            return prev - 1
          }
          return prev
        })
      }
    }, 200)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isDragging]) // Added isDragging as dependency

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setLastPosition(e.clientY)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const currentY = e.clientY
    const containerRect = dragRef.current?.parentElement?.getBoundingClientRect()
    if (!containerRect) return

    // Calculate relative position within the volume bar container
    const relativeY = currentY - containerRect.top - 20 // 20px offset from top
    const constrainedY = Math.max(0, Math.min(100, relativeY))
    
    setDragPosition(constrainedY + 20)

    // FIXED: Much higher threshold to prevent rapid increases
    if (currentY > lastPosition && volume < 100 && Math.abs(currentY - lastPosition) > 15) { // Changed from 2 to 15
      setVolume(prev => Math.min(100, prev + 2)) // 2% per pump
      // TRACK ACHIEVEMENT HERE
      trackVolumeAdjustment()
    }
    
    setLastPosition(currentY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, lastPosition, volume, trackVolumeAdjustment])

  return (
    <div style={{
      position: 'fixed',
      top: '100px', // Moved down from 20px to avoid navbar
      right: '20px',
      zIndex: 1000,
      userSelect: 'none',
      background: 'rgba(30, 41, 59, 0.95)',
      padding: '15px',
      borderRadius: '12px',
      border: '2px solid #3b82f6',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
      width: '110px', // Fixed width
      height: '200px' // Fixed height
    }}>
      {/* Title - REMOVED CHANGING TEXT */}
      <div style={{
        color: '#bfdbfe',
        fontSize: '12px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '10px',
        animation: volume > 80 ? 'flash 0.5s infinite' : 'none',
        height: '16px', // Fixed height to prevent jumping
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Volume Control
      </div>

      {/* Volume Bar Container */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '140px'
      }}>
        {/* Grey background bar */}
        <div style={{
          width: '100%',
          height: '50px',
          backgroundColor: '#64748b',
          position: 'absolute',
          top: '70px',
          borderRadius: '4px'
        }} />

        {/* Volume Bar */}
        <div style={{
          border: '4px solid #374151',
          borderTop: '15px solid #374151',
          position: 'absolute',
          top: '25px',
          left: '30px',
          width: '15px',
          height: '100px',
          backgroundColor: '#cbd5e1',
          borderRadius: '2px'
        }}>
          {/* Green fill */}
          <div style={{
            width: '100%',
            height: `${volume}%`,
            backgroundColor: volume > 90 ? '#ef4444' : volume > 70 ? '#f59e0b' : '#22c55e',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderRadius: '1px',
            transition: 'all 0.2s ease',
            boxShadow: volume > 80 ? `0 0 10px ${volume > 90 ? '#ef4444' : '#f59e0b'}` : 'none'
          }} />
        </div>

        {/* Draggable Handle */}
        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: `${dragPosition}px`,
            left: '20px',
            width: '35px',
            height: '25px',
            background: 'linear-gradient(145deg, #475569, #334155)',
            border: '2px solid #64748b',
            borderRadius: '6px',
            cursor: isDragging ? 'grabbing' : 'grab',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: isDragging ? 'none' : 'all 0.1s ease',
            zIndex: 1000,
            transform: isDragging ? 'scale(1.05)' : 'scale(1)' // Reduced scale change
          }}
        >
          {/* Handle grip lines */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '20px',
                height: '2px',
                backgroundColor: '#94a3b8',
                margin: '3px auto 1px',
                borderRadius: '1px'
              }}
            />
          ))}
        </div>

        {/* Volume Icon */}
        <div style={{
          position: 'absolute',
          top: '90px',
          left: '25px',
          fontSize: '24px',
          color: '#bfdbfe',
          animation: volume > 90 ? 'shake 0.3s infinite' : 'none'
        }}>
          {volume === 0 ? '🔇' : volume < 30 ? '🔈' : volume < 70 ? '🔉' : '🔊'}
        </div>

        {/* Volume Indicator */}
        <div style={{
          position: 'absolute',
          top: '5px',
          left: '0px',
          textAlign: 'center',
          width: '75px',
          color: volume > 90 ? '#ef4444' : volume > 70 ? '#f59e0b' : '#bfdbfe',
          fontSize: '16px',
          fontWeight: 'bold',
          textShadow: volume > 80 ? `0 0 10px ${volume > 90 ? '#ef4444' : '#f59e0b'}` : 'none',
          height: '20px', // Fixed height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {volume}%
        </div>

        {/* Warning Messages - Fixed positioning */}
        {volume > 90 && (
          <div style={{
            position: 'absolute',
            bottom: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            animation: 'pulse 1s infinite'
          }}>
            DANGER LEVEL!
          </div>
        )}

        {volume === 0 && (
          <div style={{
            position: 'absolute',
            bottom: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(64, 64, 64, 0.9)',
            color: '#94a3b8',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            Silent Mode
          </div>
        )}
      </div>

      {/* NEW: "A useless volume button" text */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '9px',
        color: '#64748b',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: '1.2',
        width: '95px',
        fontWeight: '500'
      }}>
        A useless volume button
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.05); }
        }
      `}</style>
    </div>
  )
}
